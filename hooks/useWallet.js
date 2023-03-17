'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAddress, isAddress } from 'ethers';

const STORAGE_KEY = 'walletConnected';
const SEPOLIA_CHAIN_ID = '0xaa36a7';

// Checksums an address safely; returns null if invalid
function safeChecksum(addr) {
  try {
    return isAddress(addr) ? getAddress(addr) : null;
  } catch {
    return null;
  }
}

/**
 * Lightweight wallet connection hook using window.ethereum (MetaMask).
 * Persists a "was connected" flag in localStorage so returning users
 * auto-reconnect without a popup.
 *
 * @returns {{ address, connect, disconnect, isConnecting, error, hasProvider, wrongNetwork }}
 */
export function useWallet() {
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [hasProvider, setHasProvider] = useState(false);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  // Detect provider on mount
  useEffect(() => {
    setHasProvider(typeof window !== 'undefined' && Boolean(window.ethereum));
  }, []);

  // Check current chain
  useEffect(() => {
    if (!hasProvider) return;
    window.ethereum
      .request({ method: 'eth_chainId' })
      .then((chainId) => setWrongNetwork(chainId !== SEPOLIA_CHAIN_ID))
      .catch(() => {});
  }, [hasProvider]);

  // Auto-reconnect if user previously connected
  useEffect(() => {
    if (!hasProvider) return;
    const wasConnected = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!wasConnected) return;

    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length > 0) setAddress(safeChecksum(accounts[0]));
        else localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => localStorage.removeItem(STORAGE_KEY));
  }, [hasProvider]);

  // Listen for account and chain changes
  useEffect(() => {
    if (!hasProvider) return;

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        setAddress(null);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        setAddress(safeChecksum(accounts[0]));
      }
    }

    function handleChainChanged(chainId) {
      setWrongNetwork(chainId !== SEPOLIA_CHAIN_ID);
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [hasProvider]);

  const connect = useCallback(async () => {
    if (!hasProvider) {
      setError('No wallet detected. Please install MetaMask.');
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request Sepolia network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
        setWrongNetwork(false);
      } catch (switchErr) {
        if (switchErr.code !== 4902) {
          // 4902 = chain not added; other errors mean user rejected or wallet issue
          setError('Please switch to Sepolia testnet.');
          return null;
        }
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const checksummed = safeChecksum(accounts[0]);
        setAddress(checksummed);
        localStorage.setItem(STORAGE_KEY, 'true');
        return checksummed;
      }

      setError('No accounts returned.');
      return null;
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected.');
      } else {
        setError('Failed to connect wallet.');
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [hasProvider]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { address, connect, disconnect, isConnecting, error, hasProvider, wrongNetwork };
}
