'use client';

import { useState, useMemo, useCallback } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import Card from '@/components/ui/Card';
import { SkeletonLine } from '@/components/ui/Skeleton';
import { TX_CATEGORIES, ETHERSCAN_BASE_URL } from '@/lib/constants';
import { truncateAddress, truncateHash, timeAgo } from '@/lib/utils';

const INITIAL_ROWS = 25;
const LOAD_MORE_ROWS = 20;
const SKELETON_ROWS = 10;

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: TX_CATEGORIES.EXTERNAL, label: 'ETH' },
  { key: TX_CATEGORIES.ERC20, label: 'ERC-20' },
  { key: 'nft', label: 'NFTs' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidTxHash(hash) {
  return (
    typeof hash === 'string' &&
    hash.startsWith('0x') &&
    hash.length === 66 &&
    /^0x[0-9a-fA-F]{64}$/.test(hash)
  );
}

function getAction(tx, walletAddress) {
  const isSent = tx.from?.toLowerCase() === walletAddress.toLowerCase();
  switch (tx.category) {
    case TX_CATEGORIES.ERC721:
    case TX_CATEGORIES.ERC1155:
      return isSent ? 'Transfer NFT' : 'Receive NFT';
    case TX_CATEGORIES.ERC20:
      return isSent ? 'Send Token' : 'Receive Token';
    default:
      return isSent ? 'Send' : 'Receive';
  }
}

function getActionColor(tx, walletAddress) {
  const isSent = tx.from?.toLowerCase() === walletAddress.toLowerCase();
  if (tx.category === TX_CATEGORIES.ERC721 || tx.category === TX_CATEGORIES.ERC1155) {
    return 'text-purple-400';
  }
  return isSent ? 'text-red-400' : 'text-green-400';
}

function formatValue(value) {
  if (value == null) return '-';
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num)) return '-';
  if (num === 0) return '-';
  if (num > 1_000_000) return num.toExponential(2);
  return num.toFixed(4);
}

function getTimestamp(tx) {
  return tx.metadata?.blockTimestamp
    ? new Date(tx.metadata.blockTimestamp).getTime()
    : 0;
}

function getNumericValue(tx) {
  const num = parseFloat(tx.value);
  return isNaN(num) || !isFinite(num) ? 0 : num;
}

function getAsset(tx) {
  return tx.asset || (tx.category === TX_CATEGORIES.EXTERNAL ? 'ETH' : '');
}

// ─── Sort icon ──────────────────────────────────────────────────────────────

function SortIcon({ direction }) {
  if (!direction) {
    return (
      <svg className="ml-1 inline h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
      </svg>
    );
  }
  return (
    <svg className="ml-1 inline h-3 w-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      {direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 15l4 4 4-4" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4" />
      )}
    </svg>
  );
}

// ─── CSV export ─────────────────────────────────────────────────────────────

function exportToCsv(transfers, walletAddress) {
  const headers = ['Time', 'Action', 'Asset', 'Value', 'From', 'To', 'TX Hash'];
  const rows = transfers.map((tx) => [
    tx.metadata?.blockTimestamp ?? '',
    getAction(tx, walletAddress),
    getAsset(tx),
    formatValue(tx.value),
    tx.from ?? '',
    tx.to ?? '',
    tx.hash ?? '',
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${walletAddress.slice(0, 8)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Asset</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">To</th>
            <th className="px-4 py-3">TX Hash</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <tr key={i} className="border-b border-gray-800/50">
              {Array.from({ length: 7 }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <SkeletonLine className="h-4 w-20" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * Full transactions table with sorting, filtering, address search, and CSV export.
 *
 * @param {{ address: string }} props
 */
export default function TransactionsTable({ address }) {
  const { transfers, loading, loadingMore, error, hasMore, loadMore } =
    useActivityFeed(address);
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addressSearch, setAddressSearch] = useState('');

  // ─── Toggle sort ────────────────────────────────────────────────
  const toggleSort = useCallback((key) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'desc' ? 'asc' : d === 'asc' ? null : 'desc'));
        return key;
      }
      setSortDir('desc');
      return key;
    });
  }, []);

  // Reset sortKey when direction is cleared
  const effectiveSortDir = sortDir;
  const effectiveSortKey = effectiveSortDir ? sortKey : null;

  // ─── Filtered + sorted transfers ────────────────────────────────
  const processedTransfers = useMemo(() => {
    let list = [...transfers];

    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'nft') {
        list = list.filter(
          (tx) => tx.category === TX_CATEGORIES.ERC721 || tx.category === TX_CATEGORIES.ERC1155
        );
      } else {
        list = list.filter((tx) => tx.category === categoryFilter);
      }
    }

    // Address search
    if (addressSearch.trim()) {
      const q = addressSearch.trim().toLowerCase();
      list = list.filter(
        (tx) =>
          (tx.from && tx.from.toLowerCase().includes(q)) ||
          (tx.to && tx.to.toLowerCase().includes(q))
      );
    }

    // Sort
    if (effectiveSortKey && effectiveSortDir) {
      list.sort((a, b) => {
        let cmp = 0;
        switch (effectiveSortKey) {
          case 'time':
            cmp = getTimestamp(a) - getTimestamp(b);
            break;
          case 'value':
            cmp = getNumericValue(a) - getNumericValue(b);
            break;
          case 'asset':
            cmp = getAsset(a).localeCompare(getAsset(b));
            break;
          default:
            break;
        }
        return effectiveSortDir === 'asc' ? cmp : -cmp;
      });
    }

    return list;
  }, [transfers, categoryFilter, addressSearch, effectiveSortKey, effectiveSortDir]);

  if (loading) {
    return (
      <Card className="p-0">
        <TableSkeleton />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p role="alert" className="py-4 text-center text-sm text-red-400">
          {error}
        </p>
      </Card>
    );
  }

  if (transfers.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-gray-500">
          No transactions found for this wallet on Sepolia testnet.
        </p>
      </Card>
    );
  }

  const visibleTransfers = processedTransfers.slice(0, visibleCount);
  const hasHiddenLocal = visibleCount < processedTransfers.length;
  const canFetchMore = hasMore && !hasHiddenLocal;
  const showButton = hasHiddenLocal || canFetchMore;

  function handleLoadMore() {
    if (hasHiddenLocal) {
      setVisibleCount((prev) => prev + LOAD_MORE_ROWS);
    } else if (canFetchMore) {
      loadMore();
      setVisibleCount((prev) => prev + LOAD_MORE_ROWS);
    }
  }

  function getSortDir(key) {
    return effectiveSortKey === key ? effectiveSortDir : null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: filters + search + export */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category filter pills */}
        <div className="flex items-center gap-1.5">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setCategoryFilter(f.key);
                setVisibleCount(INITIAL_ROWS);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                categoryFilter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Address search */}
        <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-gray-700 bg-gray-900/80 focus-within:border-blue-500 transition-colors sm:max-w-xs">
          <svg
            className="ml-2.5 h-3.5 w-3.5 shrink-0 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={addressSearch}
            onChange={(e) => {
              setAddressSearch(e.target.value);
              setVisibleCount(INITIAL_ROWS);
            }}
            placeholder="Filter by address…"
            className="flex-1 bg-transparent px-2.5 py-1.5 text-xs text-gray-100 placeholder-gray-500 outline-none"
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Export CSV */}
        <button
          onClick={() => exportToCsv(processedTransfers, address)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-500">
        Showing {visibleTransfers.length} of {processedTransfers.length} transactions
        {categoryFilter !== 'all' || addressSearch.trim() ? ' (filtered)' : ''}
      </p>

      {/* Table */}
      <Card className="p-0">
        {processedTransfers.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No transactions match the current filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th
                    className="cursor-pointer select-none whitespace-nowrap px-4 py-3 hover:text-gray-300 transition-colors"
                    onClick={() => toggleSort('time')}
                  >
                    Time <SortIcon direction={getSortDir('time')} />
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">Action</th>
                  <th
                    className="cursor-pointer select-none whitespace-nowrap px-4 py-3 hover:text-gray-300 transition-colors"
                    onClick={() => toggleSort('asset')}
                  >
                    Asset <SortIcon direction={getSortDir('asset')} />
                  </th>
                  <th
                    className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-right hover:text-gray-300 transition-colors"
                    onClick={() => toggleSort('value')}
                  >
                    Value <SortIcon direction={getSortDir('value')} />
                  </th>
                  <th className="whitespace-nowrap px-4 py-3">From</th>
                  <th className="whitespace-nowrap px-4 py-3">To</th>
                  <th className="whitespace-nowrap px-4 py-3">TX Hash</th>
                </tr>
              </thead>
              <tbody>
                {visibleTransfers.map((tx) => {
                  const action = getAction(tx, address);
                  const actionColor = getActionColor(tx, address);
                  const asset = getAsset(tx);
                  const value = formatValue(tx.value);
                  const time = tx.metadata?.blockTimestamp
                    ? timeAgo(tx.metadata.blockTimestamp)
                    : '-';
                  const validHash = isValidTxHash(tx.hash);

                  return (
                    <tr
                      key={tx.uniqueId}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                        {time}
                      </td>
                      <td className={`whitespace-nowrap px-4 py-3 font-medium ${actionColor}`}>
                        {action}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-200">
                        {asset || '-'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-gray-200">
                        {value}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {tx.from ? (
                          <a
                            href={`${ETHERSCAN_BASE_URL}/address/${tx.from}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-gray-400 hover:text-blue-400 transition-colors"
                            title={tx.from}
                          >
                            {truncateAddress(tx.from)}
                          </a>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {tx.to ? (
                          <a
                            href={`${ETHERSCAN_BASE_URL}/address/${tx.to}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-gray-400 hover:text-blue-400 transition-colors"
                            title={tx.to}
                          >
                            {truncateAddress(tx.to)}
                          </a>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {validHash ? (
                          <a
                            href={`${ETHERSCAN_BASE_URL}/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-gray-400 hover:text-blue-400 transition-colors"
                            title={tx.hash}
                          >
                            {truncateHash(tx.hash)}
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {showButton && (
          <div className="border-t border-gray-800 px-4 py-3">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full rounded-lg border border-gray-700 py-2 text-sm font-medium text-gray-300 hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {loadingMore ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
