import Link from 'next/link';
import { ETHERSCAN_BASE_URL } from '@/lib/constants';

/**
 * Site-wide footer — rendered on every page via layout.jsx.
 * Server Component — no interactivity needed.
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                <svg
                  className="h-3.5 w-3.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-100">Wallet Profiler</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              On-chain analytics for any Ethereum wallet. Built with Next.js, Alchemy SDK, and Recharts.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Navigate
            </span>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              Home
            </Link>
            <Link href="/#about" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
              About
            </Link>
          </div>

          {/* External */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
              Resources
            </span>
            <a
              href={ETHERSCAN_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Sepolia Etherscan
            </a>
            <a
              href="https://github.com/tenderdeve/wallet-profiler"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500">
            Sepolia Testnet Only — Portfolio Project
          </p>
          <p className="text-xs text-gray-600">
            &copy; 2023 Wallet Profiler
          </p>
        </div>
      </div>
    </footer>
  );
}
