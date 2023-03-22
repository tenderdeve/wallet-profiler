import SearchBar from '@/components/SearchBar';
import FeaturedWallets from '@/components/FeaturedWallets';
import LandingAbout from '@/components/LandingAbout';
import HeroTitle from '@/components/HeroTitle';
import FloatingWallets from '@/components/FloatingWallets';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'Wallet Profiler — Search',
  description:
    'Explore on-chain activity, token balances, NFTs, and analytics for any Ethereum wallet.',
};

export default function HomePage() {
  return (
    <ErrorBoundary>
      {/* Hero — featured wallets + preview sit at the bottom, preview cuts off at the fold */}
      <main className="hero-glow noise-overlay relative flex min-h-[calc(100vh-57px)] flex-col items-center gap-10 px-4 pt-[16vh] pb-16 sm:px-8">
        {/* Floating wallet avatars */}
        <FloatingWallets />

        {/* Hero */}
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="animate-fade-in-up">
            <HeroTitle />
          </div>
          <p className="animate-fade-in-up delay-2 whitespace-nowrap text-base text-gray-400">
            Real-time wallet insights across balances, NFTs, and transaction history.
          </p>
        </div>

        {/* Search bar */}
        <div className="animate-fade-in-up delay-3 relative z-10 w-full">
          <SearchBar />
        </div>

        {/* Featured wallets + preview — bottom of hero, intentionally overflows the fold */}
        <div className="animate-fade-in-up delay-4 relative z-10 w-full max-w-3xl">
          <FeaturedWallets />
        </div>
      </main>

      {/* Spacer between hero and about */}
      <div className="h-16" />

      {/* About section */}
      <LandingAbout />
    </ErrorBoundary>
  );
}
