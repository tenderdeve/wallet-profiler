'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAddress } from 'ethers';
import {
  LOCALSTORAGE_RECENT_SEARCHES,
  RECENT_SEARCHES_MAX,
} from '@/lib/constants';
import { isValidInput } from '@/lib/utils';

/**
 * Reads recent searches from localStorage.
 * FIX 3 — Parsed array is filtered through isValidInput() so any malicious
 * string that was somehow written to storage is never rendered or acted on.
 * @returns {string[]}
 */
function readRecentSearches() {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_RECENT_SEARCHES);
    const parsed = raw ? JSON.parse(raw) : [];
    // Sanitize: reject anything that is not a valid address or .eth name.
    return parsed
      .filter((e) => typeof e === 'string' && isValidInput(e))
      .slice(0, RECENT_SEARCHES_MAX);
  } catch {
    return [];
  }
}

/**
 * Prepends a new entry to recent searches, deduplicates, and caps at max.
 * FIX 3 — Only values that pass isValidInput() are written to storage.
 * @param {string} entry
 */
function saveRecentSearch(entry) {
  // Guard: never persist a value that is not a valid address or ENS name.
  if (!isValidInput(entry)) return;
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

      // FIX 2 — Validate before any navigation or API call.
      if (!isValidInput(trimmed)) {
        setError('Enter a valid wallet address or ENS name');
        return;
      }

      // Direct Ethereum address — navigate immediately
      if (isAddress(trimmed)) {
        navigate(trimmed, trimmed);
        return;
      }

      // ENS name — resolve via server-side API route so ALCHEMY_API_KEY stays server-only.
      // FIX 4 — ENS resolution only fires on form submit (Enter key or button click),
      // never on input change, so no debounce is needed.
      if (trimmed.endsWith('.eth')) {
        setIsResolving(true);
        try {
          const res = await fetch(
            `/api/alchemy?name=${encodeURIComponent(trimmed)}`
          );
          if (!res.ok) throw new Error('API error');
          const data = await res.json();
          const resolved = data.address;
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
    },
    [navigate]
  );

  // FIX 4 — Search only fires on Enter key or button click, never on input change.
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
      <div className="flex w-full max-w-3xl flex-col gap-2">
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
            className="glow-accent px-6 py-4 bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
        <div className="flex w-full max-w-3xl flex-col gap-2">
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
