import Link from 'next/link';
import { truncateAddress } from '@/lib/utils';

// Day 1 placeholder — full implementation arrives Day 2–4
// Will assemble: WalletProfile + ActivityFeed + StatsDashboard

export function generateMetadata({ params }) {
  return {
    title: `Wallet ${truncateAddress(params.address)} — Wallet Profiler`,
  };
}

export default function ProfilePage({ params }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
          Wallet
        </span>
        <h1 className="break-all font-mono text-lg font-semibold text-gray-100 sm:text-xl">
          {params.address}
        </h1>
      </div>
      <p className="text-sm text-gray-500">
        Profile view coming in Day 2–4.
      </p>
      <Link
        href="/"
        className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 hover:border-blue-500 hover:text-white transition-colors"
      >
        ← Back to search
      </Link>
    </main>
  );
}
