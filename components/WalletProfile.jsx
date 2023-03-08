'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useWalletProfile } from '@/hooks/useWalletProfile';
import Badge from '@/components/ui/Badge';
import StatTile from '@/components/ui/StatTile';
import Card from '@/components/ui/Card';
import { SkeletonLine, SkeletonStatCard } from '@/components/ui/Skeleton';
import { AVATAR_BASE_URL, ETHERSCAN_BASE_URL, ALCHEMY_BADGE_TRANSFERS } from '@/lib/constants';
import { truncateAddress } from '@/lib/utils';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function WalletProfileSkeleton() {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-gray-800" />
        <div className="flex flex-1 flex-col gap-3 pt-1">
          <SkeletonLine className="h-5 w-48" />
          <SkeletonLine className="h-7 w-28 rounded-full" />
          <div className="flex gap-2">
            <SkeletonLine className="h-8 w-20 rounded-lg" />
            <SkeletonLine className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
    </Card>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ address }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200"
      aria-label="Copy wallet address to clipboard"
    >
      {copied ? (
        <>
          <svg
            className="h-3.5 w-3.5 text-green-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Wallet profile header: avatar, ENS/address, personality badge,
 * stat tiles, and action links.
 *
 * @param {{ address: string }} props
 */
export default function WalletProfile({ address }) {
  const { profile, badge, loading, error } = useWalletProfile(address);

  if (loading) return <WalletProfileSkeleton />;

  if (error) {
    return (
      <Card>
        <p role="alert" className="py-4 text-center text-sm text-red-400">
          {error}
        </p>
      </Card>
    );
  }

  const displayName = profile.ensName ?? truncateAddress(address);

  return (
    <Card>
      {/* Avatar + identity + actions */}
      <div className="flex flex-wrap items-start gap-4">
        <Image
          src={`${AVATAR_BASE_URL}/${address}.svg`}
          alt={`Avatar for ${displayName}`}
          width={64}
          height={64}
          className="rounded-full"
          unoptimized
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Name row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="break-all font-mono text-sm font-semibold text-gray-100 sm:text-base">
              {displayName}
            </span>
            {/* Show truncated address underneath when an ENS name is displayed */}
            {profile.ensName && (
              <span className="font-mono text-xs text-gray-500">
                {truncateAddress(address)}
              </span>
            )}
          </div>

          {/* Badge */}
          {badge && <Badge label={badge.label} variant={badge.variant} />}

          {/* Action buttons */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CopyButton address={address} />
            <a
              href={`${ETHERSCAN_BASE_URL}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-200"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Etherscan
            </a>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="ETH Balance" value={profile.balance} suffix="ETH" />
        <StatTile
          label="Transactions"
          value={
            profile.txCount >= ALCHEMY_BADGE_TRANSFERS
              ? `${ALCHEMY_BADGE_TRANSFERS}+`
              : profile.txCount.toLocaleString()
          }
        />
        <StatTile label="NFTs Owned" value={profile.nftCount.toLocaleString()} />
        <StatTile label="Wallet Age" value={profile.walletAge} suffix="days" />
      </div>
    </Card>
  );
}
