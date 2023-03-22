import Link from 'next/link';
import { ETHERSCAN_BASE_URL } from '@/lib/constants';

/**
 * Site-wide footer — rendered on every page via layout.jsx.
 * Server Component — no interactivity needed.
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="h-7 w-7 shrink-0" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="#0966C0" />
                <text x="32" y="44" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="36" fill="#ffffff">W</text>
              </svg>
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
            <Link href="/" className="w-fit text-sm text-gray-400 hover:text-gray-200 transition-colors">
              Home
            </Link>
            <Link href="/#about" className="w-fit text-sm text-gray-400 hover:text-gray-200 transition-colors">
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
              className="w-fit text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Sepolia Etherscan
            </a>
            <a
              href="https://github.com/tenderdeve/wallet-profiler"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-sm text-gray-400 hover:text-gray-200 transition-colors"
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
