import Link from 'next/link';
import WalletProfile from '@/components/WalletProfile';
import ActivityFeed from '@/components/ActivityFeed';
import { truncateAddress } from '@/lib/utils';

// Day 2 — ActivityFeed wired in.
// Day 3 — WalletProfile replaces the address placeholder.
// Day 4 — StatsDashboard added below the feed.

export function generateMetadata({ params }) {
  return {
    title: `Wallet ${truncateAddress(params.address)} — Wallet Profiler`,
  };
}

export default function ProfilePage({ params }) {
  const { address } = params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
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

      {/* Activity Feed */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-gray-100">
          Activity
        </h2>
        <ActivityFeed address={address} />
      </section>

      {/* Stats Dashboard — added Day 4 */}
    </main>
  );
}
