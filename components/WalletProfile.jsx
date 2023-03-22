'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react'; // useEffect + useRef added for FIX 7
import { useWalletProfile } from '@/hooks/useWalletProfile';
import Badge from '@/components/ui/Badge';
import StatTile from '@/components/ui/StatTile';
import Card from '@/components/ui/Card';
import { SkeletonLine, SkeletonStatCard } from '@/components/ui/Skeleton';
import { AVATAR_BASE_URL, ETHERSCAN_BASE_URL, ALCHEMY_BADGE_TRANSFERS } from '@/lib/constants';
import { truncateAddress } from '@/lib/utils';

// ─── Security helpers ─────────────────────────────────────────────────────────

// FIX 1 + FIX 4 — validates address is a well-formed Ethereum hex address before embedding in any URL
function isValidEthAddress(address) {
  return typeof address === 'string' && /^0x[0-9a-fA-F]{40}$/.test(address);
}

// FIX 3 — rejects ENS names that don't match *.eth format before rendering; prevents unexpected characters
function sanitizeENS(name) {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > 253) return null;
  if (!/^[a-zA-Z0-9._\-]+\.eth$/.test(trimmed)) return null;
  return trimmed;
}

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
  const copyTimerRef = useRef(null); // FIX 7 — ref tracks the reset timer so it can be cleared on unmount

  // FIX 7 — clears any pending timer on unmount; prevents setState being called on an unmounted component
  useEffect(() => {
    return () => clearTimeout(copyTimerRef.current);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      clearTimeout(copyTimerRef.current); // FIX 7 — cancel existing timer before starting a new one
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
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
  const [avatarError, setAvatarError] = useState(false);
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

  // FIX 1 + FIX 4 — single validation result reused for both avatar URL and Etherscan link
  const validAddress = isValidEthAddress(address);
  // FIX 1 — avatar URL only constructed when address is valid; prevents injection via crafted URL param
  const avatarUrl = validAddress ? `${AVATAR_BASE_URL}/${address}.svg` : null;

  // FIX 3 — sanitize ENS name from API response before rendering; falls back to truncated address if invalid
  const sanitizedEns = sanitizeENS(profile.ensName);
  const displayName = sanitizedEns ?? truncateAddress(address);

  return (
    <Card>
      {/* Avatar + identity + actions */}
      <div className="flex flex-wrap items-start gap-4">
        {/* Avatar — validated URL with React-state fallback on load failure */}
        {avatarUrl && !avatarError ? (
          <Image
            src={avatarUrl}
            alt={`Avatar for ${displayName}`}
            width={64}
            height={64}
            className="rounded-full"
            unoptimized
            referrerPolicy="no-referrer"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-700 font-mono text-sm font-semibold text-gray-300">
            {address.slice(0, 2)}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Name row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="break-all font-mono text-sm font-semibold text-gray-100 sm:text-base">
              {displayName}
            </span>
            {/* FIX 3 — secondary address shown only when a sanitized ENS name is present */}
            {sanitizedEns && (
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
            {/* FIX 4 — Etherscan link only rendered when address is valid; prevents malformed href from crafted param */}
            {validAddress && (
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
            )}
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* FIX 2 — balance null when getEthBalance failed; suffix omitted alongside '--' */}
        <StatTile
          label="ETH Balance"
          value={profile.balance ?? '--'}
          suffix={profile.balance != null ? 'ETH' : undefined}
        />
        {/* FIX 2 — txCount null when getTransactionCount failed */}
        <StatTile
          label="Transactions"
          value={
            profile.txCount == null
              ? '--'
              : profile.txCount >= ALCHEMY_BADGE_TRANSFERS
              ? `${ALCHEMY_BADGE_TRANSFERS}+`
              : profile.txCount.toLocaleString()
          }
        />
        {/* FIX 5 — nftCount null when getNftCount failed; renders '--' instead of crashing on .toLocaleString() */}
        <StatTile
          label="NFTs Owned"
          value={profile.nftCount != null ? profile.nftCount.toLocaleString() : '--'}
        />
        {/* FIX 6 — walletAge null → '--'; walletAge 0 → 'New' for brand-new wallets or clock-skewed timestamps */}
        <StatTile
          label="Wallet Age"
          value={
            profile.walletAge == null
              ? '--'
              : profile.walletAge === 0
              ? 'New'
              : profile.walletAge
          }
          suffix={profile.walletAge != null && profile.walletAge > 0 ? 'days' : undefined}
        />
      </div>
    </Card>
  );
}
