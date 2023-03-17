import { formatEther, isAddress } from 'ethers';

/**
 * Pure utility functions — no side effects, no external dependencies.
 * All functions are individually importable.
 */

/**
 * Converts a block timestamp string to a human-readable relative time.
 * Guards against future timestamps (clock skew) returning negative values.
 * @param {string} dateStr - ISO date string from Alchemy metadata
 * @returns {string} e.g. "3m ago", "2h ago", "5d ago"
 */
export function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 0) return 'just now';

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Validates a search input as either a valid Ethereum address or an ENS name.
 * Shared by SearchBar and Navbar — single source of truth.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidInput(value) {
  const trimmed = value.trim();
  if (isAddress(trimmed)) return true;
  if (trimmed.endsWith('.eth') && trimmed.length > 4) return true;
  return false;
}

/**
 * Truncates an Ethereum address to first 6 + last 4 chars.
 * @param {string} address - Full 0x address
 * @returns {string} e.g. "0xd8dA...6045"
 */
export function truncateAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/**
 * Truncates a TX hash to first 10 + last 4 chars.
 * @param {string} hash - Full transaction hash
 * @returns {string} e.g. "0x3f2a1b9c…d4e1"
 */
export function truncateHash(hash) {
  if (!hash) return '';
  return `${hash.slice(0, 10)}…${hash.slice(-4)}`;
}

/**
 * Formats a raw BigInt ETH balance to a human-readable string.
 * @param {bigint} rawBalance - From alchemy.core.getBalance()
 * @param {number} [decimals=4] - Decimal places to round to
 * @returns {string} e.g. "1.2345"
 */
export function formatEth(rawBalance, decimals = 4) {
  if (rawBalance == null) return '0';
  return parseFloat(formatEther(rawBalance)).toFixed(decimals);
}

/**
 * Groups an array of transfers by calendar month.
 * @param {Array} transfers - Alchemy transfer objects with metadata.blockTimestamp
 * @returns {Object} Map of "MMM YY" → count, e.g. { "Jan 24": 12, "Feb 24": 8 }
 */
export function groupTransfersByMonth(transfers) {
  return transfers.reduce((acc, tx) => {
    if (!tx.metadata?.blockTimestamp) return acc;
    const date = new Date(tx.metadata.blockTimestamp);
    const key = date.toLocaleString('en-US', {
      month: 'short',
      year: '2-digit',
    });
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Returns the last N calendar months as "MMM YY" strings,
 * including the current month.
 * @param {number} [count=6]
 * @returns {string[]}
 */
export function getLastNMonths(count = 6) {
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(
      d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    );
  }
  return months;
}

