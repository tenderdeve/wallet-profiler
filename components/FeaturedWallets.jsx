'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FEATURED_WALLETS, AVATAR_BASE_URL, ETHERSCAN_BASE_URL } from '@/lib/constants';
import { truncateAddress } from '@/lib/utils';

// Dummy preview data — no API calls on the home page, actual data loads on profile
const PREVIEW_DATA = {
  [FEATURED_WALLETS[0].address]: {
    balance: '51.1027', txCount: '2,847', nftCount: '1,184', firstTx: 'Jan 2018',
    badge: 'NFT Collector', badgeColor: 'text-blue-400 bg-blue-500/10',
  },
  [FEATURED_WALLETS[1].address]: {
    balance: '1,247,893.42', txCount: '18.2M', nftCount: '42', firstTx: 'Aug 2017',
    badge: 'Whale', badgeColor: 'text-amber-400 bg-amber-500/10',
  },
  [FEATURED_WALLETS[2].address]: {
    balance: '89,241.08', txCount: '5.1M', nftCount: '0', firstTx: 'Mar 2019',
    badge: 'Exchange', badgeColor: 'text-green-400 bg-green-500/10',
  },
};

function WalletPreview({ wallet }) {
  const data = PREVIEW_DATA[wallet.address];

  const stats = [
    { label: 'ETH Balance', value: `${data.balance} ETH` },
    { label: 'Transactions', value: data.txCount },
    { label: 'NFTs Owned', value: data.nftCount },
    { label: 'First TX', value: data.firstTx },
  ];

  return (
    <div className="relative overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image
          src={`${AVATAR_BASE_URL}/${wallet.address}.svg`}
          alt={`${wallet.label} avatar`}
          width={56}
          height={56}
          className="rounded-full border-2 border-gray-700"
          unoptimized
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-100">{wallet.label}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${data.badgeColor}`}>
              {data.badge}
            </span>
          </div>
          <p className="font-mono text-xs text-gray-500">{truncateAddress(wallet.address)}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-800 bg-gray-900/50 p-2.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
              {stat.label}
            </span>
            <p className="mt-0.5 text-sm font-bold text-gray-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Teaser rows — fade out */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-gray-800/50 bg-gray-900/30 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-gray-300">Sepolia Testnet</span>
          </div>
          <a
            href={`${ETHERSCAN_BASE_URL}/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Etherscan →
          </a>
        </div>
        <div className="rounded-lg border border-gray-800/50 bg-gray-900/30 px-3 py-2">
          <span className="text-xs text-gray-400">Recent activity, token holdings, NFT collection...</span>
        </div>
        <div className="rounded-lg border border-gray-800/50 bg-gray-900/30 px-3 py-2">
          <span className="text-xs text-gray-400">Full transaction history with charts and analytics</span>
        </div>
      </div>

      {/* Gradient fade-out */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg-surface) 85%)' }}
      />

      {/* View more */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <Link
          href={`/profile/${wallet.address}`}
          className="glow-accent rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-all"
        >
          View more →
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedWallets() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeWallet = FEATURED_WALLETS[activeIndex];

  const handleHover = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleClick = useCallback((address) => {
    router.push(`/profile/${address}`);
  }, [router]);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
        Featured wallets
      </span>

      {/* Wallet selector cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {FEATURED_WALLETS.map((wallet, i) => (
          <button
            key={wallet.address}
            onMouseEnter={() => handleHover(i)}
            onClick={() => handleClick(wallet.address)}
            className={`card-hover group flex items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-lg shadow-black/5 transition-all ${
              i === activeIndex
                ? 'border-blue-500 bg-gray-800 gradient-border'
                : 'border-gray-800 bg-gray-900 hover:border-gray-700 hover:bg-gray-800'
            }`}
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
            {i === activeIndex && (
              <div className="ml-auto h-2 w-2 shrink-0 rounded-full bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Preview panel — below the fold, dummy data, no API calls */}
      <div className="gradient-border relative min-h-[260px] overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-lg shadow-black/5">
        <WalletPreview wallet={activeWallet} />
      </div>
    </div>
  );
}
