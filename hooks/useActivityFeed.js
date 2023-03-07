'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Fetches transfers via the server-side /api/transfers proxy.
 * The Alchemy SDK (and its API key) lives only on the server.
 *
 * @param {string} address
 * @param {'from'|'to'} direction
 * @param {string|undefined} pageKey
 * @returns {Promise<{ transfers: Array, pageKey: string|undefined }>}
 */
async function fetchTransfers(address, direction, pageKey) {
  const params = new URLSearchParams({ address, direction });
  if (pageKey) params.set('pageKey', pageKey);

  const res = await fetch(`/api/transfers?${params}`);
  if (!res.ok) throw new Error('Failed to fetch transfers');
  return res.json();
}

/**
 * Merges new transfers into an existing list, deduplicates by uniqueId,
 * and sorts the combined list by block timestamp descending.
 *
 * uniqueId is Alchemy's stable identifier for a single transfer event.
 * It handles the case where the same TX hash appears in both the 'from'
 * and 'to' queries (e.g. self-transfers).
 *
 * @param {Array} existing - Current transfer list
 * @param {Array} incoming - New transfers to merge in
 * @returns {Array}
 */
function mergeAndSort(existing, incoming) {
  const seen = new Set(existing.map((tx) => tx.uniqueId));

  const deduped = incoming.filter((tx) => {
    if (seen.has(tx.uniqueId)) return false;
    seen.add(tx.uniqueId);
    return true;
  });

  return [...existing, ...deduped].sort((a, b) => {
    const tA = a.metadata?.blockTimestamp
      ? new Date(a.metadata.blockTimestamp).getTime()
      : 0;
    const tB = b.metadata?.blockTimestamp
      ? new Date(b.metadata.blockTimestamp).getTime()
      : 0;
    return tB - tA;
  });
}

/**
 * Manages the full lifecycle of the activity feed:
 * initial fetch, pagination, loading states, and errors.
 *
 * Fetches both outbound ('from') and inbound ('to') transfers in parallel,
 * merges them into a single sorted feed. Load More continues both cursors
 * independently so neither stream is starved.
 *
 * @param {string} address - Wallet address to profile
 * @returns {{
 *   transfers: Array,
 *   loading: boolean,
 *   loadingMore: boolean,
 *   error: string|null,
 *   hasMore: boolean,
 *   loadMore: () => void,
 * }}
 */
export function useActivityFeed(address) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // Pagination cursors — stored in refs so they don't cause re-renders.
  const fromPageKeyRef = useRef(undefined);
  const toPageKeyRef = useRef(undefined);
  // Prevents a second loadMore from firing before the first resolves.
  const loadingMoreRef = useRef(false);

  const fetchInitial = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    fromPageKeyRef.current = undefined;
    toPageKeyRef.current = undefined;

    try {
      // Fetch both directions in parallel to minimise wait time.
      const [sent, received] = await Promise.all([
        fetchTransfers(address, 'from', undefined),
        fetchTransfers(address, 'to', undefined),
      ]);

      fromPageKeyRef.current = sent.pageKey;
      toPageKeyRef.current = received.pageKey;

      setTransfers(mergeAndSort([], [...sent.transfers, ...received.transfers]));
      setHasMore(!!(sent.pageKey || received.pageKey));
    } catch {
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const loadMore = useCallback(async () => {
    // Guard: already loading or both cursors are exhausted.
    if (
      loadingMoreRef.current ||
      (!fromPageKeyRef.current && !toPageKeyRef.current)
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      // Only request the next page for a direction that still has one.
      const [sentMore, receivedMore] = await Promise.all([
        fromPageKeyRef.current
          ? fetchTransfers(address, 'from', fromPageKeyRef.current)
          : { transfers: [], pageKey: undefined },
        toPageKeyRef.current
          ? fetchTransfers(address, 'to', toPageKeyRef.current)
          : { transfers: [], pageKey: undefined },
      ]);

      fromPageKeyRef.current = sentMore.pageKey;
      toPageKeyRef.current = receivedMore.pageKey;

      setTransfers((prev) =>
        mergeAndSort(prev, [...sentMore.transfers, ...receivedMore.transfers])
      );
      setHasMore(!!(sentMore.pageKey || receivedMore.pageKey));
    } catch {
      setError('Failed to load more transactions.');
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [address]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  return { transfers, loading, loadingMore, error, hasMore, loadMore };
}
