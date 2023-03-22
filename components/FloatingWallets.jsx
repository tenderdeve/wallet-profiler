'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AVATAR_BASE_URL } from '@/lib/constants';
import { truncateAddress } from '@/lib/utils';

/**
 * Floating wallet avatars scattered around the hero section.
 * Each avatar is blurred by default, sharpens on hover, and links to the profile.
 * Inspired by Uniswap's floating token orbs — adapted for wallet profiles.
 */

const FLOATING_WALLETS = [
  { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', label: 'Vitalik', size: 56, position: { top: '12%', left: '8%' }, delay: 0 },
  { address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', label: 'Binance', size: 44, position: { top: '20%', right: '10%' }, delay: 0.8 },
  { address: '0x40B38765696e3d5d8d9d834D8AaD4bB6e418E489', label: 'Robinhood', size: 48, position: { bottom: '28%', left: '6%' }, delay: 1.6 },
  { address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', label: 'DeFi Whale', size: 40, position: { top: '35%', right: '6%' }, delay: 2.2 },
  { address: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326', label: 'Builder', size: 36, position: { bottom: '18%', right: '14%' }, delay: 1.2 },
  { address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', label: 'Collector', size: 42, position: { top: '60%', left: '12%' }, delay: 0.4 },
  { address: '0x28C6c06298d514Db089934071355E5743bf21d60', label: 'Exchange', size: 34, position: { top: '8%', left: '28%' }, delay: 1.8 },
  { address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', label: 'Staker', size: 38, position: { bottom: '35%', right: '25%' }, delay: 2.6 },
];

function FloatingAvatar({ wallet }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/profile/${wallet.address}`}
      className="group absolute hidden md:block"
      style={{
        ...wallet.position,
        animation: `float ${3 + wallet.delay}s ease-in-out infinite`,
        animationDelay: `${wallet.delay}s`,
        zIndex: 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${wallet.label} — ${truncateAddress(wallet.address)}`}
    >
      {/* Glow ring behind avatar */}
      <div
        className="absolute inset-[-4px] rounded-full transition-all duration-500"
        style={{
          background: hovered
            ? 'radial-gradient(circle, rgba(22,130,222,0.4), transparent 70%)'
            : 'radial-gradient(circle, rgba(22,130,222,0.15), transparent 70%)',
          transform: hovered ? 'scale(1.6)' : 'scale(1.2)',
        }}
      />

      {/* Avatar */}
      <div
        className="relative overflow-hidden rounded-full border transition-all duration-500"
        style={{
          width: wallet.size,
          height: wallet.size,
          filter: hovered ? 'blur(0px) brightness(1.1)' : 'blur(2px) brightness(0.7)',
          borderColor: hovered ? 'rgba(22,130,222,0.6)' : 'rgba(255,255,255,0.08)',
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          boxShadow: hovered
            ? '0 0 20px rgba(22,130,222,0.3), 0 0 40px rgba(99,102,241,0.15)'
            : '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <Image
          src={`${AVATAR_BASE_URL}/${wallet.address}.svg`}
          alt={`${wallet.label} avatar`}
          width={wallet.size}
          height={wallet.size}
          className="rounded-full"
          unoptimized
        />
      </div>

      {/* Label tooltip on hover */}
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-700 bg-gray-900/95 px-2.5 py-1 text-xs font-medium text-gray-200 shadow-lg backdrop-blur-sm transition-all duration-300"
        style={{
          top: wallet.size + 8,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-4px)',
          pointerEvents: 'none',
        }}
      >
        {wallet.label}
        <span className="ml-1.5 font-mono text-gray-500">{truncateAddress(wallet.address)}</span>
      </div>
    </Link>
  );
}

export default function FloatingWallets() {
  return (
    <>
      {FLOATING_WALLETS.map((wallet) => (
        <FloatingAvatar key={wallet.address} wallet={wallet} />
      ))}
    </>
  );
}
