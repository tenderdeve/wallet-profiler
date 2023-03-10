import SearchBar from '@/components/SearchBar';
import FeaturedWallets from '@/components/FeaturedWallets';
import ErrorBoundary from '@/components/ErrorBoundary'; // FIX 5 — catches render errors from blockchain components

export const metadata = {
  title: 'Wallet Profiler — Search',
  description:
    'Explore on-chain activity, token balances, NFTs, and analytics for any Ethereum wallet.',
};

export default function HomePage() {
  return (
    // FIX 5 — Wraps all content so Alchemy-related render failures show a safe
    // fallback instead of a blank/crashed page.
    <ErrorBoundary>
      <main className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-10 px-4 py-16 sm:px-8">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
            Sepolia Testnet
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            Wallet Profiler
          </h1>
          <p className="max-w-md text-base text-gray-400">
            Search any Ethereum address to explore its on-chain activity,
            token balances, NFTs, and analytics.
          </p>
        </div>

        {/* Search bar — Client Component (needs router + localStorage) */}
        <SearchBar />

        {/* Featured wallets — Server Component (static navigation cards) */}
        <FeaturedWallets />
      </main>
    </ErrorBoundary>
  );
}
