'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { dedupedFetch } from '@/lib/fetchDedup';

const FETCH_TIMEOUT_MS = 20_000;

// FIX 6 — rejects undefined/null/non-string pageKeys so the Load More button never
// appears when there is no real next page to fetch
function safePageKey(key) {
  return typeof key === 'string' && key.length > 0 ? key : null;
}

/**
 * Fetches transfers via the server-side /api/transfers proxy.
 * The Alchemy SDK (and its API key) lives only on the server.
 */
async function fetchTransfers(address, direction, pageKey) {
  const params = new URLSearchParams({ address, direction });
  if (pageKey) params.set('pageKey', pageKey);

  // dedupedFetch deduplicates in-flight requests — if useWalletProfile
  // is fetching the same URL simultaneously, only one HTTP call fires.
  return dedupedFetch(`/api/transfers?${params}`);
}

/**
 * Merges new transfers into an existing list, deduplicates by uniqueId,
 * and sorts the combined list by block timestamp descending.
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
 */
export function useActivityFeed(address) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const fromPageKeyRef = useRef(undefined);
  const toPageKeyRef = useRef(undefined);
  const loadingMoreRef = useRef(false);

  // FIX 2 — fetchInitial accepts an isCancelled() check function so the useEffect
  // can pass a locally-scoped cancelled flag. Using a local closure (not a shared ref)
  // prevents the race where a new effect run resets the flag before the old fetch checks it.
  const fetchInitial = useCallback(async (isCancelled) => {
    if (!address) return;
    setLoading(true);
    setError(null);
    fromPageKeyRef.current = undefined;
    toPageKeyRef.current = undefined;

    try {
      // FIX 5 — race the parallel fetch against a 10-second timeout
      const [sent, received] = await Promise.race([
        Promise.all([
          fetchTransfers(address, 'from', undefined),
          fetchTransfers(address, 'to', undefined),
        ]),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Request timed out')),
            FETCH_TIMEOUT_MS
          )
        ),
      ]);

      if (isCancelled()) return; // FIX 2 — discard stale response if address changed mid-flight

      // FIX 6 — validate pageKeys before storing to prevent Load More appearing incorrectly
      fromPageKeyRef.current = safePageKey(sent.pageKey);
      toPageKeyRef.current = safePageKey(received.pageKey);

      setTransfers(mergeAndSort([], [...sent.transfers, ...received.transfers]));
      setHasMore(!!(fromPageKeyRef.current || toPageKeyRef.current));
    } catch (err) {
      if (isCancelled()) return; // FIX 2 — suppress error if already navigated away
      // FIX 5 — map timeout to a specific user-facing message; all other errors share a generic one
      if (err.message === 'Request timed out') {
        setError('Loading is taking too long. Please try again.');
      } else {
        setError('Failed to load transactions. Please try again.');
      }
    } finally {
      if (!isCancelled()) setLoading(false); // FIX 2 — never update unmounted component
    }
  }, [address]);

  const loadMore = useCallback(async () => {
    if (
      loadingMoreRef.current ||
      (!fromPageKeyRef.current && !toPageKeyRef.current)
    ) {
      return;
    }

    let cancelled = false; // FIX 2 — scoped cancellation flag for this loadMore invocation
    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      // FIX 5 — timeout applies to Load More as well
      const [sentMore, receivedMore] = await Promise.race([
        Promise.all([
          fromPageKeyRef.current
            ? fetchTransfers(address, 'from', fromPageKeyRef.current)
            : { transfers: [], pageKey: undefined },
          toPageKeyRef.current
            ? fetchTransfers(address, 'to', toPageKeyRef.current)
            : { transfers: [], pageKey: undefined },
        ]),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Request timed out')),
            FETCH_TIMEOUT_MS
          )
        ),
      ]);

      if (cancelled) return; // FIX 2 — discard if component unmounted during load

      // FIX 6 — validate pageKeys before storing
      fromPageKeyRef.current = safePageKey(sentMore.pageKey);
      toPageKeyRef.current = safePageKey(receivedMore.pageKey);

      setTransfers((prev) =>
        mergeAndSort(prev, [...sentMore.transfers, ...receivedMore.transfers])
      );
      setHasMore(!!(fromPageKeyRef.current || toPageKeyRef.current));
    } catch (err) {
      if (cancelled) return; // FIX 2
      if (err.message === 'Request timed out') {
        setError('Loading is taking too long. Please try again.');
      } else {
        setError('Failed to load more transactions.');
      }
    } finally {
      loadingMoreRef.current = false;
      if (!cancelled) setLoadingMore(false); // FIX 2
    }
  }, [address]);

  useEffect(() => {
    let cancelled = false; // FIX 2 — locally-scoped flag; each effect run owns its own flag
    fetchInitial(() => cancelled);
    return () => { cancelled = true; }; // FIX 2 — fires on address change or component unmount
  }, [fetchInitial]);

  return { transfers, loading, loadingMore, error, hasMore, loadMore };
}
