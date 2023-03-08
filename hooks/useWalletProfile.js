'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TX_CATEGORIES,
  BADGE_WHALE_ETH_THRESHOLD,
  BADGE_NFT_TX_RATIO,
  BADGE_DEFI_TX_RATIO,
  BADGE_NEW_USER_TX_COUNT,
} from '@/lib/constants';
import { walletAgeInDays } from '@/lib/utils';

/**
 * Derives a wallet personality badge from profile data + recent transfer history.
 * Priority order: Whale > New User > NFT Collector > DeFi Degen > Regular User
 */
function deriveBadge({ balance, txCount, transfers }) {
  if (parseFloat(balance) > BADGE_WHALE_ETH_THRESHOLD) {
    return { label: 'Whale', variant: 'whale' };
  }
  if (txCount < BADGE_NEW_USER_TX_COUNT) {
    return { label: 'New User', variant: 'new' };
  }
  const total = transfers.length;
  if (total > 0) {
    const nftTxs = transfers.filter(
      (tx) => tx.category === TX_CATEGORIES.ERC721 || tx.category === TX_CATEGORIES.ERC1155
    ).length;
    const erc20Txs = transfers.filter((tx) => tx.category === TX_CATEGORIES.ERC20).length;
    if (nftTxs / total > BADGE_NFT_TX_RATIO) return { label: 'NFT Collector', variant: 'nft' };
    if (erc20Txs / total > BADGE_DEFI_TX_RATIO) return { label: 'DeFi Degen', variant: 'defi' };
  }
  return { label: 'Regular User', variant: 'default' };
}

async function fetchWalletData(address) {
  const res = await fetch(`/api/wallet?address=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error('Failed to fetch wallet data');
  return res.json();
}

/**
 * Fetches both outbound and inbound transfers for badge calculation.
 * Up to 50 per direction (100 total) — matches ALCHEMY_BADGE_TRANSFERS intent.
 * Gracefully returns empty array if either direction fails.
 */
async function fetchRecentTransfers(address) {
  const [fromRes, toRes] = await Promise.all([
    fetch(`/api/transfers?address=${encodeURIComponent(address)}&direction=from`),
    fetch(`/api/transfers?address=${encodeURIComponent(address)}&direction=to`),
  ]);
  const fromData = fromRes.ok ? await fromRes.json() : { transfers: [] };
  const toData = toRes.ok ? await toRes.json() : { transfers: [] };
  return [...(fromData.transfers ?? []), ...(toData.transfers ?? [])];
}

/**
 * Manages the full lifecycle of the wallet profile:
 * parallel data fetch, badge derivation, loading state, and errors.
 */
export function useWalletProfile(address) {
  const [profile, setProfile] = useState(null);
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(
    async (isCancelled) => {
      if (!address) return;
      setLoading(true);
      setError(null);

      try {
        const [walletData, transfers] = await Promise.all([
          fetchWalletData(address),
          fetchRecentTransfers(address),
        ]);

        if (isCancelled()) return;

        // Use total asset transfer activity (from + to) rather than the Ethereum nonce.
        // eth_getTransactionCount returns only outbound TX count; test wallets that
        // mostly receive funds would show 0, and the badge logic would always fire
        // "New User" because the nonce never reaches the threshold.
        const txCount = transfers.length;

        setProfile({
          ...walletData,
          txCount,
          walletAge: walletAgeInDays(walletData.firstTxTimestamp),
        });
        setBadge(
          deriveBadge({ balance: walletData.balance, txCount, transfers })
        );
      } catch {
        if (isCancelled()) return;
        setError('Failed to load wallet profile.');
      } finally {
        if (!isCancelled()) setLoading(false);
      }
    },
    [address]
  );

  useEffect(() => {
    let cancelled = false;
    fetchAll(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [fetchAll]);

  return { profile, badge, loading, error };
}
