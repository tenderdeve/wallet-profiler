'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ALCHEMY_DASHBOARD_TRANSFERS,
  TX_CATEGORIES,
} from '@/lib/constants';
import { groupTransfersByMonth, getLastNMonths } from '@/lib/utils';

const FETCH_TIMEOUT_MS = 20_000;
const STAGGER_DELAY_MS = 2_000;
const TOP_TOKENS_LIMIT = 5;
const MONTHS_TO_SHOW = 6;

/**
 * Fetches transfers from the server-side proxy.
 * maxCount per direction is half the dashboard total (100 each).
 */
async function fetchDashboardTransfers(address, direction) {
  const maxCount = ALCHEMY_DASHBOARD_TRANSFERS / 2;
  const res = await fetch(
    `/api/transfers?address=${encodeURIComponent(address)}&direction=${direction}&maxCount=${maxCount}`
  );
  if (!res.ok) return { transfers: [] };
  return res.json();
}

/**
 * Builds monthly TX bar chart data from transfers.
 * Shows last 6 months, filling 0 for months with no activity.
 */
function buildMonthlyData(transfers) {
  const grouped = groupTransfersByMonth(transfers);
  const months = getLastNMonths(MONTHS_TO_SHOW);
  return months.map((month) => ({
    month,
    count: grouped[month] ?? 0,
  }));
}

/**
 * Builds TX type pie chart data — one slice per category.
 */
function buildTypeBreakdown(transfers) {
  const counts = {};
  for (const tx of transfers) {
    const cat = tx.category ?? 'unknown';
    counts[cat] = (counts[cat] || 0) + 1;
  }

  const labels = {
    [TX_CATEGORIES.EXTERNAL]: 'ETH Transfers',
    [TX_CATEGORIES.ERC20]: 'ERC-20 Tokens',
    [TX_CATEGORIES.ERC721]: 'NFTs (721)',
    [TX_CATEGORIES.ERC1155]: 'NFTs (1155)',
  };

  return Object.entries(counts)
    .map(([category, count]) => ({
      name: labels[category] ?? category,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Builds top tokens horizontal bar chart data.
 * Sums value by asset name for outbound ERC-20 transfers only.
 */
function buildTopTokens(transfers) {
  const sums = {};
  for (const tx of transfers) {
    if (tx.category !== TX_CATEGORIES.ERC20) continue;
    if (!tx.asset) continue;
    const val = parseFloat(tx.value) || 0;
    sums[tx.asset] = (sums[tx.asset] || 0) + val;
  }

  return Object.entries(sums)
    .map(([token, total]) => ({
      token,
      total: parseFloat(total.toFixed(4)),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_TOKENS_LIMIT);
}

/**
 * Manages the stats dashboard lifecycle:
 * fetches 200 transfers (100 from + 100 to), transforms into three chart datasets.
 */
export function useStatsDashboard(address) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(
    async (isCancelled) => {
      if (!address) return;
      setLoading(true);
      setError(null);

      try {
        // Stagger: wait before firing so WalletProfile + ActivityFeed
        // finish their Alchemy calls first, avoiding free-tier rate limits.
        await new Promise((r) => setTimeout(r, STAGGER_DELAY_MS));
        if (isCancelled()) return;

        const [fromData, toData] = await Promise.race([
          Promise.all([
            fetchDashboardTransfers(address, 'from'),
            fetchDashboardTransfers(address, 'to'),
          ]),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), FETCH_TIMEOUT_MS)
          ),
        ]);

        if (isCancelled()) return;

        const allTransfers = [
          ...(fromData.transfers ?? []),
          ...(toData.transfers ?? []),
        ];

        setChartData({
          monthly: buildMonthlyData(allTransfers),
          typeBreakdown: buildTypeBreakdown(allTransfers),
          topTokens: buildTopTokens(fromData.transfers ?? []),
          totalCount: allTransfers.length,
        });
      } catch (err) {
        if (isCancelled()) return;
        setError(
          err.message === 'Request timed out'
            ? 'Stats request timed out. Please try again.'
            : 'Failed to load stats.'
        );
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

  return { chartData, loading, error };
}
