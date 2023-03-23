import Link from 'next/link';
import { isAddress } from 'ethers';
import WalletProfile from '@/components/WalletProfile';
import ActivityFeed from '@/components/ActivityFeed';
import StatsDashboard from '@/components/StatsDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';
import Card from '@/components/ui/Card';
import { truncateAddress } from '@/lib/utils';

export function generateMetadata({ params }) {
  const label = isAddress(params.address)
    ? truncateAddress(params.address)
    : 'Invalid';
  return { title: `Wallet ${label} — Wallet Profiler` };
}

export default function ProfilePage({ params }) {
  const { address } = params;

  if (!isAddress(address)) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors"
        >
          ← Back to search
        </Link>
        <Card className="mt-6">
          <p role="alert" className="py-8 text-center text-sm text-red-400">
            Invalid Ethereum address. Please check the URL and try again.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <ErrorBoundary>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to search
        </Link>

        {/* Wallet Profile Header */}
        <div className="mt-6 mb-8">
          <WalletProfile address={address} />
        </div>

        {/* Dashboard + Activity — 2-column on desktop */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: Charts (wider) */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <span className="text-[11px] font-medium uppercase tracking-widest text-gray-700">
                Analytics
              </span>
              <h2 className="mt-1 text-lg font-semibold text-gray-100">
                Stats Overview
              </h2>
            </div>
            <StatsDashboard address={address} />
          </div>

          {/* Right: Activity Feed */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-widest text-gray-700">
                  Recent
                </span>
                <h2 className="mt-1 text-lg font-semibold text-gray-100">
                  Activity
                </h2>
              </div>
              <Link
                href={`/profile/${address}/transactions`}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All →
              </Link>
            </div>
            <ActivityFeed address={address} />
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
