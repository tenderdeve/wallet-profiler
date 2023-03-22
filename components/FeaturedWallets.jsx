import Link from 'next/link';
import Image from 'next/image';
import { FEATURED_WALLETS, AVATAR_BASE_URL } from '@/lib/constants';
import { truncateAddress } from '@/lib/utils';

/**
 * Static grid of featured wallet cards.
 * Server Component — no interactivity needed, pure navigation links.
 */
export default function FeaturedWallets() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
        Featured wallets
      </span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FEATURED_WALLETS.map((wallet) => (
          <Link
            key={wallet.address}
            href={`/profile/${wallet.address}`}
            className="card-hover gradient-border group flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 shadow-lg shadow-black/5 hover:border-blue-500 hover:bg-gray-800 transition-colors"
          >
            <Image
              src={`${AVATAR_BASE_URL}/${wallet.address}.svg`}
              alt={`${wallet.label} avatar`}
              width={36}
              height={36}
              className="rounded-full shrink-0"
              unoptimized
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-gray-100 group-hover:text-white">
                {wallet.label}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {truncateAddress(wallet.address)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
