'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useStatsDashboard } from '@/hooks/useStatsDashboard';
import Card from '@/components/ui/Card';
import { SkeletonBlock } from '@/components/ui/Skeleton';
import { CHART_COLORS, PIE_CHART_COLORS } from '@/lib/constants';

// ─── Chart theme ────────────────────────────────────────────────────────────

// Resolved at render time — see useChartColors() hook below
const AXIS_STYLE_BASE = { fontSize: 12 };

/** Reads CSS custom property values so Recharts inline SVG fills match the theme. */
function useChartColors() {
  const [colors, setColors] = useState({ axis: '#71717a', tooltipBg: '#1e1e2e', tooltipBorder: '#2e2e42' });
  useEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    setColors({
      axis: style.getPropertyValue('--color-text-muted').trim() || '#71717a',
      tooltipBg: style.getPropertyValue('--color-bg-elevated').trim() || '#1e1e2e',
      tooltipBorder: style.getPropertyValue('--color-border-subtle').trim() || '#2e2e42',
      textPrimary: style.getPropertyValue('--color-text-primary').trim() || '#eeeef4',
      textSecondary: style.getPropertyValue('--color-text-secondary').trim() || '#9898b0',
    });

    // Re-read on theme change
    const observer = new MutationObserver(() => {
      const s = getComputedStyle(document.documentElement);
      setColors({
        axis: s.getPropertyValue('--color-text-muted').trim() || '#71717a',
        tooltipBg: s.getPropertyValue('--color-bg-elevated').trim() || '#1e1e2e',
        tooltipBorder: s.getPropertyValue('--color-border-subtle').trim() || '#2e2e42',
        textPrimary: s.getPropertyValue('--color-text-primary').trim() || '#eeeef4',
        textSecondary: s.getPropertyValue('--color-text-secondary').trim() || '#9898b0',
      });
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return colors;
}
// Tooltip and axis styles are now resolved at runtime via useChartColors() hook
// to ensure Recharts inline SVG fills match the active theme.

// ─── Skeleton ───────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card><SkeletonBlock className="h-72 w-full" /></Card>
      <Card><SkeletonBlock className="h-72 w-full" /></Card>
      <Card><SkeletonBlock className="h-72 w-full" /></Card>
    </div>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────

function EmptyChart({ label }) {
  return (
    <div className="flex h-72 items-center justify-center">
      <p className="text-sm text-gray-500">No {label} data available</p>
    </div>
  );
}

// ─── Chart 1: Monthly TX Count (vertical bar) ──────────────────────────────

function MonthlyChart({ data, colors }) {
  const hasData = data.some((d) => d.count > 0);
  if (!hasData) return <EmptyChart label="monthly activity" />;
  const tickStyle = { ...AXIS_STYLE_BASE, fill: colors.axis };
  const tooltip = {
    contentStyle: { backgroundColor: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, fontSize: 13 },
    labelStyle: { color: colors.textPrimary },
    itemStyle: { color: colors.textSecondary },
  };

  return (
    <ResponsiveContainer width="100%" height={264}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
        <XAxis dataKey="month" tick={tickStyle} tickLine={false} axisLine={false} />
        <YAxis tick={tickStyle} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip {...tooltip} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
        <Bar dataKey="count" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} name="Transactions" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Chart 2: TX Type Breakdown (pie) ───────────────────────────────────────

function TypePieChart({ data, colors }) {
  if (data.length === 0) return <EmptyChart label="transaction type" />;
  const tooltip = {
    contentStyle: { backgroundColor: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, fontSize: 13 },
    labelStyle: { color: colors.textPrimary },
    itemStyle: { color: colors.textSecondary },
  };

  return (
    <ResponsiveContainer width="100%" height={296}>
      <PieChart margin={{ top: 8, right: 24, bottom: 0, left: 24 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="42%"
          outerRadius={72}
          innerRadius={36}
          paddingAngle={2}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius + 20;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text x={x} y={y} fill={colors.textPrimary} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600}>
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltip} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: colors.textSecondary, fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Chart 3: Top Tokens Sent (horizontal bar) ─────────────────────────────

function TopTokensChart({ data, colors }) {
  if (data.length === 0) return <EmptyChart label="token" />;
  const tickStyle = { ...AXIS_STYLE_BASE, fill: colors.axis };
  const tooltip = {
    contentStyle: { backgroundColor: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, fontSize: 13 },
    labelStyle: { color: colors.textPrimary },
    itemStyle: { color: colors.textSecondary },
  };

  return (
    <ResponsiveContainer width="100%" height={264}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <XAxis type="number" tick={tickStyle} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="token"
          tick={tickStyle}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip {...tooltip} />
        <Bar dataKey="total" fill={CHART_COLORS.green} radius={[0, 4, 4, 0]} name="Total Sent" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * Stats dashboard: 3 charts visualising wallet transfer activity.
 * Responsive 3-column grid (1 col mobile → 3 col desktop).
 *
 * @param {{ address: string }} props
 */
export default function StatsDashboard({ address }) {
  const { chartData, loading, error } = useStatsDashboard(address);
  const colors = useChartColors();

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <Card>
        <p role="alert" className="py-4 text-center text-sm text-red-400">
          {error}
        </p>
      </Card>
    );
  }

  if (!chartData) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Full-width monthly chart */}
      <Card>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Monthly Transaction Volume</h3>
        <MonthlyChart data={chartData.monthly} colors={colors} />
      </Card>

      {/* Two smaller charts side-by-side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-sm font-medium text-gray-400">TX Type Breakdown</h3>
          <TypePieChart data={chartData.typeBreakdown} colors={colors} />
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-medium text-gray-400">Top Tokens Sent</h3>
          <TopTokensChart data={chartData.topTokens} colors={colors} />
        </Card>
      </div>
    </div>
  );
}
