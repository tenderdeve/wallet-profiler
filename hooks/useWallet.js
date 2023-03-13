'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'walletConnected';

/**
 * Lightweight wallet connection hook using window.ethereum (MetaMask).
 * Persists a "was connected" flag in localStorage so returning users
 * auto-reconnect without a popup. No heavy dependencies (wagmi, ethers provider).
 *
 * @returns {{ address, connect, disconnect, isConnecting, error, hasProvider }}
 */
export function useWallet() {
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [hasProvider, setHasProvider] = useState(false);

  // Detect MetaMask on mount
  useEffect(() => {
    setHasProvider(typeof window !== 'undefined' && Boolean(window.ethereum));
  }, []);

  // Auto-reconnect if user previously connected
  useEffect(() => {
    if (!hasProvider) return;

    const wasConnected = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!wasConnected) return;

    // Silent reconnect — eth_accounts doesn't trigger a popup
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length > 0) setAddress(accounts[0]);
        else localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => localStorage.removeItem(STORAGE_KEY));
  }, [hasProvider]);

  // Listen for account/chain changes from the wallet
  useEffect(() => {
    if (!hasProvider) return;

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        setAddress(null);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        setAddress(accounts[0]);
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  }, [hasProvider]);

  const connect = useCallback(async () => {
    if (!hasProvider) {
      setError('No wallet detected. Please install MetaMask.');
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        localStorage.setItem(STORAGE_KEY, 'true');
        return accounts[0];
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

  return { address, connect, disconnect, isConnecting, error, hasProvider };
}
