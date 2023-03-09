'use client';

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

const AXIS_STYLE = { fontSize: 12, fill: '#9CA3AF' };
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: 8,
    fontSize: 13,
  },
  labelStyle: { color: '#F3F4F6' },
  itemStyle: { color: '#D1D5DB' },
};

// ─── Skeleton ───────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card><SkeletonBlock className="h-56 w-full" /></Card>
      <Card><SkeletonBlock className="h-56 w-full" /></Card>
      <Card><SkeletonBlock className="h-56 w-full" /></Card>
    </div>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────

function EmptyChart({ label }) {
  return (
    <div className="flex h-56 items-center justify-center">
      <p className="text-sm text-gray-500">No {label} data available</p>
    </div>
  );
}

// ─── Chart 1: Monthly TX Count (vertical bar) ──────────────────────────────

function MonthlyChart({ data }) {
  const hasData = data.some((d) => d.count > 0);
  if (!hasData) return <EmptyChart label="monthly activity" />;

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <XAxis dataKey="month" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
        <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
        <Bar dataKey="count" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} name="Transactions" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Chart 2: TX Type Breakdown (pie) ───────────────────────────────────────

function TypePieChart({ data }) {
  if (data.length === 0) return <EmptyChart label="transaction type" />;

  return (
    <ResponsiveContainer width="100%" height={224}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={36}
          paddingAngle={2}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...TOOLTIP_STYLE} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Chart 3: Top Tokens Sent (horizontal bar) ─────────────────────────────

function TopTokensChart({ data }) {
  if (data.length === 0) return <EmptyChart label="token" />;

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
        <XAxis type="number" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="token"
          tick={AXIS_STYLE}
          tickLine={false}
          axisLine={false}
          width={72}
        />
        <Tooltip {...TOOLTIP_STYLE} />
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Monthly Activity</h3>
        <MonthlyChart data={chartData.monthly} />
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-medium text-gray-400">TX Type Breakdown</h3>
        <TypePieChart data={chartData.typeBreakdown} />
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-medium text-gray-400">Top Tokens Sent</h3>
        <TopTokensChart data={chartData.topTokens} />
      </Card>
    </div>
  );
}
