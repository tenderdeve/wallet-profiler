'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAddress } from 'ethers';
import { FEATURED_WALLETS } from '@/lib/constants';
import { truncateAddress } from '@/lib/utils';
import ConnectWallet from '@/components/ConnectWallet';
import ThemeSwitcher from '@/components/ThemeSwitcher';

/**
 * Validates a search input as either a valid Ethereum address or an ENS name.
 * Reuses the same logic as SearchBar's isValidInput.
 */
function isValidInput(value) {
  const trimmed = value.trim();
  if (isAddress(trimmed)) return true;
  if (trimmed.endsWith('.eth') && trimmed.length > 4) return true;
  return false;
}

/**
 * Compact search bar for the navbar with a suggestions dropdown.
 * Shows featured wallets on focus; handles address navigation and ENS resolution.
 */
function NavSearch({ onNavigate }) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = useCallback(
    (address) => {
      router.push(`/profile/${address}`);
      setInput('');
      setDropdownOpen(false);
      onNavigate?.();
    },
    [router, onNavigate]
  );

  const handleSearch = useCallback(
    async (query) => {
      const trimmed = query.trim();
      if (!trimmed || !isValidInput(trimmed)) return;

      setDropdownOpen(false);

      if (isAddress(trimmed)) {
        navigateTo(trimmed);
        return;
      }

      if (trimmed.endsWith('.eth')) {
        setIsResolving(true);
        try {
          const res = await fetch(`/api/alchemy?name=${encodeURIComponent(trimmed)}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.address) navigateTo(data.address);
        } catch {
          // Fail silently in navbar — home page search has full error display
        } finally {
          setIsResolving(false);
        }
      }
    },
    [navigateTo]
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex w-full items-center overflow-hidden rounded-lg border border-gray-700 bg-gray-900/80 focus-within:border-blue-500 transition-colors">
        <svg
          className="ml-3 h-4 w-4 shrink-0 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(input);
            if (e.key === 'Escape') setDropdownOpen(false);
          }}
          placeholder="Search address or ENS…"
          className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none"
          disabled={isResolving}
          aria-label="Search wallet address"
          spellCheck={false}
          autoComplete="off"
        />
        {isResolving && (
          <svg
            className="mr-3 h-4 w-4 animate-spin text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
        )}
      </div>

      {/* Suggestions dropdown */}
      {dropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
          <div className="px-3 py-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
              Suggested wallets
            </span>
          </div>
          {FEATURED_WALLETS.map((wallet) => (
            <button
              key={wallet.address}
              onClick={() => navigateTo(wallet.address)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-800 transition-colors"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs font-semibold text-gray-300">
                {wallet.label.charAt(0)}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-gray-200">{wallet.label}</span>
                <span className="font-mono text-xs text-gray-500">{truncateAddress(wallet.address)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Persistent navbar — rendered on every page via layout.jsx.
 * Logo (left), compact search (center), Connect Wallet placeholder (right).
 * Mobile: hamburger toggles a dropdown with search + connect.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg
              className="h-4 w-4 text-white"
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
          <span className="text-sm font-bold text-gray-100 tracking-tight">
            Wallet Profiler
          </span>
        </Link>

        {/* Desktop: search + connect */}
        <div className="hidden items-center gap-3 md:flex md:flex-1 md:max-w-md md:mx-8">
          {!isHome && <NavSearch />}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeSwitcher />
          <ConnectWallet />
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:text-gray-100 md:hidden transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-gray-800 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {!isHome && <NavSearch onNavigate={() => setMenuOpen(false)} />}
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <div className="flex-1">
                <ConnectWallet compact />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
