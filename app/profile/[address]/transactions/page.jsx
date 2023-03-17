import Link from 'next/link';
import { isAddress } from 'ethers';
import TransactionsTable from '@/components/TransactionsTable';
import Card from '@/components/ui/Card';
import { truncateAddress } from '@/lib/utils';

export function generateMetadata({ params }) {
  const label = isAddress(params.address) ? truncateAddress(params.address) : 'Invalid';
  return { title: `Transactions — ${label} — Wallet Profiler` };
}

export default function TransactionsPage({ params }) {
  const { address } = params;

  if (!isAddress(address)) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors">
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Back to profile */}
      <Link
        href={`/profile/${address}`}
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
        Back to profile
      </Link>

      <div className="mt-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-100">Transactions</h1>
          <p className="mt-1 font-mono text-sm text-gray-500">
            {truncateAddress(address)}
          </p>
        </div>
      </div>

      <TransactionsTable address={address} />
    </main>
  );
}
