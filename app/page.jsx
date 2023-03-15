import SearchBar from '@/components/SearchBar';
import FeaturedWallets from '@/components/FeaturedWallets';
import LandingAbout from '@/components/LandingAbout';
import ErrorBoundary from '@/components/ErrorBoundary';

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

        {/* Learn More anchor */}
        <a
          href="#about"
          className="mt-2 flex flex-col items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Learn More
          <svg
            className="h-4 w-4 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </a>
      </main>

      {/* About section — below the fold */}
      <LandingAbout />
    </ErrorBoundary>
  );
}
