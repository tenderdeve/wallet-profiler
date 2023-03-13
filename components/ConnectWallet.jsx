'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { truncateAddress } from '@/lib/utils';

// ─── Modal ──────────────────────────────────────────────────────────────────

function ConnectModal({ onClose, onConnect, isConnecting, error, hasProvider }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-[101] mx-4 flex w-full max-w-lg overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl sm:max-w-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Connect a Wallet"
      >
        {/* Left panel — wallet list */}
        <div className="flex w-1/2 flex-col border-r border-gray-800 p-6">
          <h2 className="text-lg font-bold text-gray-100">Connect a Wallet</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-gray-500">
            Recommended
          </p>

          <div className="mt-4 flex flex-col gap-2">
            {/* MetaMask option */}
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-left hover:border-blue-500 hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <svg viewBox="0 0 35 33" className="h-6 w-6" aria-hidden="true">
                  <path d="M32.96 1l-13.14 9.72 2.45-5.73L32.96 1z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.66 1l13.02 9.81L13.35 4.99 2.66 1zm25.57 22.53l-3.5 5.34 7.49 2.06 2.14-7.28-6.13-.12zm-25.4.12l2.13 7.28 7.47-2.06-3.48-5.34-6.12.12z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.09 14.51l-2.08 3.14 7.41.34-.24-7.97-5.09 4.49zm11.44 0l-5.16-4.58-.17 8.06 7.4-.34-2.07-3.14zm-11.25 12.02l4.46-2.16-3.86-3.01-.6 5.17zm7.86-2.16l4.49 2.16-.63-5.17-3.86 3.01z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24.63 26.53l-4.49-2.16.36 2.93-.04 1.23 4.17-1.99zm-14.89 0l4.17 2 -.04-1.24.35-2.93-4.48 2.17z" fill="#D7C1B3" stroke="#D7C1B3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.99 20.81l-3.73-1.1 2.63-1.2 1.1 2.3zm7.64 0l1.1-2.3 2.65 1.2-3.75 1.1z" fill="#233447" stroke="#233447" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.74 26.53l.63-5.34-4.11.12 3.48 5.22zm15.52-5.34l.63 5.34 3.48-5.22-4.11-.12zm3.71-3.56l-7.4.34.69 3.8 1.1-2.3 2.65 1.2 2.96-3.04zm-18.71 3.04l2.65-1.2 1.09 2.3.69-3.8-7.41-.34 2.98 3.04z" fill="#CD6116" stroke="#CD6116" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.28 17.63l3.06 5.97-.1-2.98-2.96-2.99zm18.06 2.99l-.11 2.98 3.07-5.97-2.96 2.99zm-10.65-2.65l-.69 3.8.87 4.49.2-5.91-.38-2.38zm5.24 0l-.37 2.37.18 5.92.87-4.49-.68-3.8z" fill="#E4751F" stroke="#E4751F" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.63 20.81l-.87 4.49.63.44 3.86-3.01.11-2.98-3.73 1.06zm-11.37-1.06l.1 2.98 3.86 3.01.63-.44-.87-4.49-3.72-1.06z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.71 28.53l.04-1.23-.34-.29h-4.94l-.32.29.02 1.23-4.17-2 1.46 1.19 2.95 2.04h5.02l2.96-2.04 1.45-1.19-4.13 2z" fill="#C0AD9E" stroke="#C0AD9E" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.14 24.37l-.63-.44h-3.64l-.63.44-.35 2.93.32-.29h4.94l.34.29-.35-2.93z" fill="#161616" stroke="#161616" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M33.52 11.35l1.1-5.36L32.96 1l-11.82 8.77 4.55 3.83 6.42 1.87 1.42-1.64-.62-.44 .98-.89-.75-.58.98-.75-.65-.5zM.5 5.99l1.12 5.36-.72.53.98.75-.74.58.98.89-.62.44 1.4 1.64 6.43-1.87 4.55-3.83L2.66 1 .5 5.99z" fill="#763D16" stroke="#763D16" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M32.11 15.47l-6.42-1.87 1.94 2.9-2.88 5.66 3.8-.05h5.67l-2.11-6.64zm-19.68-1.87l-6.42 1.87-2.1 6.64h5.65l3.8.05-2.88-5.66 1.95-2.9zm8.5 3.37l.41-7.06 1.87-5.06h-8.3l1.85 5.06.42 7.06.16 2.4.02 5.89h3.64l.02-5.9.16-2.39z" fill="#F6851B" stroke="#F6851B" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-100">
                {isConnecting ? 'Connecting…' : 'MetaMask'}
              </span>
            </button>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-400">{error}</p>
          )}

          {!hasProvider && (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs text-blue-400 hover:underline"
            >
              Don&apos;t have MetaMask? Install it here
            </a>
          )}
        </div>

        {/* Right panel — info */}
        <div className="flex w-1/2 flex-col items-center justify-center p-6 text-center">
          <h3 className="text-lg font-bold text-gray-100">What is a Wallet?</h3>

          <div className="mt-6 flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-200">A Home for your Digital Assets</p>
              <p className="text-xs leading-relaxed text-gray-400">
                Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <svg className="h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-200">A New Way to Log In</p>
              <p className="text-xs leading-relaxed text-gray-400">
                Instead of creating new accounts and passwords on every website, just connect your wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * Connect Wallet button for the Navbar.
 *
 * Disconnected → opens a modal with MetaMask as the only option.
 * Connected → shows truncated address + disconnect button.
 * On successful connect → auto-redirects to /profile/[address].
 *
 * @param {{ compact?: boolean }} props — compact mode for mobile
 */
export default function ConnectWallet({ compact = false }) {
  const router = useRouter();
  const { address, connect, disconnect, isConnecting, error, hasProvider } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);

  const handleConnect = useCallback(async () => {
    const connectedAddress = await connect();
    if (connectedAddress) {
      setModalOpen(false);
      router.push(`/profile/${connectedAddress}`);
    }
  }, [connect, router]);

  // Connected state — show address + disconnect
  if (address) {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'w-full' : ''}`}>
        <button
          onClick={() => router.push(`/profile/${address}`)}
          className={`flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-200 hover:border-blue-500 hover:text-white transition-colors ${compact ? 'flex-1' : ''}`}
          title={address}
        >
          <div className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
          <span className="font-mono text-xs">{truncateAddress(address)}</span>
        </button>
        <button
          onClick={disconnect}
          className="rounded-lg border border-gray-700 px-2.5 py-2 text-gray-400 hover:border-red-500 hover:text-red-400 transition-colors"
          aria-label="Disconnect wallet"
          title="Disconnect"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Disconnected state — button opens modal
  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 transition-colors ${compact ? 'w-full px-4 py-2.5' : 'px-4 py-2'}`}
        aria-label="Connect wallet"
      >
        Connect Wallet
      </button>

      {modalOpen && (
        <ConnectModal
          onClose={() => setModalOpen(false)}
          onConnect={handleConnect}
          isConnecting={isConnecting}
          error={error}
          hasProvider={hasProvider}
        />
      )}
    </>
  );
}
