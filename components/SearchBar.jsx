'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAddress } from 'ethers';
import { resolveEnsName } from '@/lib/services/wallet';
import {
  LOCALSTORAGE_RECENT_SEARCHES,
  RECENT_SEARCHES_MAX,
} from '@/lib/constants';

/**
 * Reads recent searches from localStorage.
 * Wrapped in try/catch — localStorage can be unavailable (private mode, SSR).
 * @returns {string[]}
 */
function readRecentSearches() {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_RECENT_SEARCHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Prepends a new entry to recent searches, deduplicates, and caps at max.
 * @param {string} entry
 */
function saveRecentSearch(entry) {
  try {
    const existing = readRecentSearches();
    const updated = [entry, ...existing.filter((e) => e !== entry)].slice(
      0,
      RECENT_SEARCHES_MAX
    );
    localStorage.setItem(LOCALSTORAGE_RECENT_SEARCHES, JSON.stringify(updated));
  } catch {
    // Non-critical — silently ignore if storage is unavailable
  }
}

export default function SearchBar() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches client-side only — localStorage is not available on the server
  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  const navigate = useCallback(
    (address, originalQuery) => {
      saveRecentSearch(originalQuery);
      setRecentSearches(readRecentSearches());
      router.push(`/profile/${address}`);
    },
    [router]
  );

  const handleSearch = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setError(null);

      // Direct Ethereum address — navigate immediately
      if (isAddress(trimmed)) {
        navigate(trimmed, trimmed);
        return;
      }

      // ENS name — resolve first
      if (trimmed.endsWith('.eth')) {
        setIsResolving(true);
        try {
          const resolved = await resolveEnsName(trimmed);
          if (!resolved) {
            setError(
              'ENS name could not be resolved. Note: ENS resolution has limited support on Sepolia testnet.'
            );
            return;
          }
          navigate(resolved, trimmed);
        } catch {
          setError('Failed to resolve ENS name. Please try again.');
        } finally {
          setIsResolving(false);
        }
        return;
      }

      setError('Enter a valid Ethereum address (0x…) or ENS name (.eth)');
    },
    [navigate]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') handleSearch(input);
    },
    [handleSearch, input]
  );

  const clearRecentSearches = useCallback(() => {
    try {
      localStorage.removeItem(LOCALSTORAGE_RECENT_SEARCHES);
    } catch {
      // Non-critical
    }
    setRecentSearches([]);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Search input */}
      <div className="flex w-full max-w-2xl flex-col gap-2">
        <div className="flex w-full overflow-hidden rounded-xl border border-gray-700 bg-gray-900 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter wallet address (0x…) or ENS name (.eth)"
            className="flex-1 bg-transparent px-5 py-4 text-gray-100 placeholder-gray-500 outline-none text-base"
            disabled={isResolving}
            aria-label="Wallet address or ENS name"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={() => handleSearch(input)}
            disabled={isResolving || !input.trim()}
            className="px-6 py-4 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Search wallet"
          >
            {isResolving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Resolving…
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Inline error message */}
        {error && (
          <p role="alert" className="px-1 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="flex w-full max-w-2xl flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Recent searches
            </span>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((entry) => (
              <button
                key={entry}
                onClick={() => {
                  setInput(entry);
                  handleSearch(entry);
                }}
                className="rounded-full border border-gray-700 bg-gray-800 px-4 py-1.5 text-sm text-gray-300 hover:border-blue-500 hover:text-white transition-colors"
              >
                {entry.endsWith('.eth')
                  ? entry
                  : `${entry.slice(0, 6)}…${entry.slice(-4)}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
