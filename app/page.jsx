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
      <main className="hero-glow noise-overlay relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-10 px-4 py-16 sm:px-8">
        {/* Floating wallet avatars — blurred, sharpen on hover, link to profiles */}
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

        {/* Featured wallets */}
        <div className="animate-fade-in-up delay-4 relative z-10">
          <FeaturedWallets />
        </div>

        {/* Learn More anchor */}
        <a
          href="#about"
          className="animate-fade-in delay-5 relative z-10 mt-2 flex flex-col items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors"
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
