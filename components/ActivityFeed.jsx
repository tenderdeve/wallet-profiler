'use client';

import { useState } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { SkeletonFeedItem } from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';
import { TX_CATEGORIES, ETHERSCAN_BASE_URL } from '@/lib/constants';
import { truncateHash, timeAgo } from '@/lib/utils';

const SKELETON_COUNT = 8;
const INITIAL_DISPLAY_COUNT = 20;
const LOAD_MORE_INCREMENT = 15;

// ─── Security helpers ─────────────────────────────────────────────────────────

/**
 * FIX 1 — validates a TX hash before using it in a URL.
 * Guards against javascript: protocol injection via crafted hash values.
 * @param {*} hash
 * @returns {boolean}
 */
function isValidTxHash(hash) {
  return (
    typeof hash === 'string' &&
    hash.startsWith('0x') &&
    hash.length === 66 &&
    /^0x[0-9a-fA-F]{64}$/.test(hash)
  );
}

/**
 * FIX 3 — sanitizes any string from the Alchemy response before rendering.
 * Strips non-display characters, caps length, and falls back to 'Unknown'.
 * Prevents unexpected characters from asset names breaking layout or leaking markup.
 * @param {*} str
 * @returns {string}
 */
function sanitizeDisplayString(str) {
  if (typeof str !== 'string') return 'Unknown';
  const cleaned = str.trim().replace(/[^a-zA-Z0-9 ._\-$%]/g, '');
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}...` : cleaned;
}

/**
 * FIX 4 — formats a transfer value safely, guarding against extreme numbers,
 * NaN, Infinity, and unexpectedly long string representations.
 * Prevents layout-breaking display from scientific notation or huge values.
 * @param {*} value
 * @returns {string}
 */
function formatValue(value) {
  if (value == null) return '0';
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num)) return '0';
  let result;
  if (num > 1_000_000) {
    result = `${num.toExponential(2)} (large)`;
  } else {
    result = num.toFixed(4);
  }
  return result.length > 20 ? `${result.slice(0, 20)}...` : result;
}

// ─── Label + icon helpers ─────────────────────────────────────────────────────

/**
 * Derives the human-readable label, icon type, icon colour class, and
 * right-column value string from a single Alchemy transfer object.
 *
 * Colour scheme:
 *   green  = received (ETH / ERC-20)
 *   red    = sent (ETH / ERC-20)
 *   blue   = ERC-721 NFT
 *   purple = ERC-1155 multi-token
 */
function getTxMeta(tx, walletAddress) {
  const isSent = tx.from?.toLowerCase() === walletAddress.toLowerCase();

  // FIX 3 — sanitize asset name from Alchemy before embedding in any string or rendering
  const asset = sanitizeDisplayString(tx.asset || '');

  // FIX 4 — use formatValue for all numeric display; null means "don't show" (zero / missing)
  const formattedValue = formatValue(tx.value);
  const value = formattedValue !== '0' ? formattedValue : null;

  switch (tx.category) {
    case TX_CATEGORIES.ERC721:
      return {
        // FIX 3 — label sanitized via sanitizeDisplayString applied to asset above
        label: sanitizeDisplayString(isSent
          ? 'Transferred NFT'
          : `Minted NFT${asset ? ` ${asset}` : ''}`),
        iconType: 'nft',
        iconColorClass: 'bg-blue-500/20 text-blue-400',
        valueDisplay: asset || null,
      };

    case TX_CATEGORIES.ERC1155:
      return {
        label: sanitizeDisplayString(isSent
          ? 'Transferred NFT'
          : `Received NFT${asset ? ` ${asset}` : ''}`),
        iconType: 'nft',
        iconColorClass: 'bg-purple-500/20 text-purple-400',
        valueDisplay: asset || null,
      };

    case TX_CATEGORIES.ERC20:
      return {
        label: sanitizeDisplayString(isSent
          ? `Sent ${value ? `${value} ` : ''}${asset}`.trim()
          : `Received ${value ? `${value} ` : ''}${asset}`.trim()),
        iconType: isSent ? 'sent' : 'received',
        iconColorClass: isSent
          ? 'bg-red-500/20 text-red-400'
          : 'bg-green-500/20 text-green-400',
        // FIX 3 — valueDisplay uses sanitized asset; FIX 4 — value from formatValue
        valueDisplay: value ? `${value} ${asset}` : asset || null,
      };

    default: // external (ETH)
      return {
        label: sanitizeDisplayString(isSent
          ? `Sent ${value ? `${value} ETH` : 'ETH'}`
          : `Received ${value ? `${value} ETH` : 'ETH'}`),
        iconType: isSent ? 'sent' : 'received',
        iconColorClass: isSent
          ? 'bg-red-500/20 text-red-400'
          : 'bg-green-500/20 text-green-400',
        valueDisplay: value ? `${value} ETH` : null,
      };
  }
}

// ─── Icon component ───────────────────────────────────────────────────────────

function TxIcon({ type, colorClass }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
    >
      {type === 'sent' && (
        // Arrow pointing up-right (outbound)
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      )}
      {type === 'received' && (
        // Arrow pointing down-left (inbound)
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
          />
        </svg>
      )}
      {type === 'nft' && (
        // Image frame icon (NFT)
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
        </svg>
      )}
    </div>
  );
}

// ─── Single feed item ─────────────────────────────────────────────────────────

function FeedItem({ tx, address }) {
  const { label, iconType, iconColorClass, valueDisplay } = getTxMeta(
    tx,
    address
  );
  const timestamp = tx.metadata?.blockTimestamp
    ? timeAgo(tx.metadata.blockTimestamp)
    : null;

  // FIX 1 — validate hash before constructing URL; invalid hash renders as plain text only
  const validHash = isValidTxHash(tx.hash);
  const explorerUrl = validHash ? `${ETHERSCAN_BASE_URL}/tx/${tx.hash}` : null;

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <TxIcon type={iconType} colorClass={iconColorClass} />

      {/* Label + hash / timestamp */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium text-gray-100">
          {label}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          {/* FIX 1 — only render an anchor when the hash passes validation */}
          {explorerUrl ? (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-blue-400 transition-colors"
              title={tx.hash}
            >
              {truncateHash(tx.hash)}
            </a>
          ) : (
            // FIX 1 — invalid hash rendered as unclickable text, no href constructed
            <span className="font-mono">{truncateHash(tx.hash)}</span>
          )}
          {timestamp && (
            <>
              <span aria-hidden="true">·</span>
              <span>{timestamp}</span>
            </>
          )}
        </div>
      </div>

      {/* Right-aligned value */}
      {valueDisplay && (
        <span className="shrink-0 text-right text-sm font-medium text-gray-300">
          {valueDisplay}
        </span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Twitter-style transaction feed for a given wallet address.
 * Handles loading skeletons, empty state, error state, and pagination.
 *
 * @param {{ address: string }} props
 */
export default function ActivityFeed({ address }) {
  const { transfers, loading, loadingMore, error, hasMore, loadMore } =
    useActivityFeed(address);
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);

  // Loading — show skeleton rows while the first fetch is in-flight
  if (loading) {
    return (
      <Card className="p-0">
        <div className="divide-y divide-gray-800">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="px-5">
              <SkeletonFeedItem />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Error — show message; don't expose raw error details
  if (error) {
    return (
      <Card>
        <p role="alert" className="py-4 text-center text-sm text-red-400">
          {error}
        </p>
      </Card>
    );
  }

  // Empty — wallet has no transfers on Sepolia
  if (transfers.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-gray-500">
          No transactions found for this wallet on Sepolia testnet.
        </p>
      </Card>
    );
  }

  const visibleTransfers = transfers.slice(0, visibleCount);
  const hasHiddenLocal = visibleCount < transfers.length;
  const canFetchMore = hasMore && !hasHiddenLocal;

  function handleLoadMore() {
    if (hasHiddenLocal) {
      setVisibleCount((prev) => prev + LOAD_MORE_INCREMENT);
    } else if (canFetchMore) {
      loadMore();
      setVisibleCount((prev) => prev + LOAD_MORE_INCREMENT);
    }
  }

  const showButton = hasHiddenLocal || canFetchMore;

  return (
    <Card className="p-0">
      <div className="divide-y divide-gray-800">
        {visibleTransfers.map((tx) => (
          <FeedItem key={tx.uniqueId} tx={tx} address={address} />
        ))}
      </div>

      {showButton && (
        <div className="border-t border-gray-800 px-5 py-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="w-full rounded-lg border border-gray-700 py-2.5 text-sm font-medium text-gray-300 hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {loadingMore ? (
              <span className="flex items-center justify-center gap-2">
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
                Loading…
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </Card>
  );
}
