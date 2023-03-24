/**
 * Landing page sections — Tools for the Chain, Operational Workflow, Tech Stack, FAQs.
 * Design direction: glass-border cards, gradient fills, bento grid, sticky FAQ.
 */

import FaqAccordion from '@/components/FaqAccordion';

const FEATURES = [
  {
    title: 'Activity Feed',
    description:
      'Every transaction in a clean, Twitter-style feed — sends, receives, NFT mints, token transfers — labeled and timestamped.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    largeIcon: (
      <svg className="h-32 w-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    span: 'sm:col-span-2',
    gradient: 'bg-gradient-to-br from-blue-600/15 via-blue-500/5 to-transparent',
    iconAccent: 'text-blue-400/30 group-hover:text-blue-400/50',
    glow: 'shadow-blue-500/5',
  },
  {
    title: 'Wallet Identity',
    description:
      'ENS name, balance, NFT count, wallet age, and personality badge.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    largeIcon: (
      <svg className="h-32 w-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    span: '',
    gradient: 'bg-gradient-to-br from-green-600/15 via-green-500/5 to-transparent',
    iconAccent: 'text-green-400/30 group-hover:text-green-400/50',
    glow: 'shadow-green-500/5',
  },
  {
    title: 'Analytics',
    description:
      'Monthly activity, transaction breakdown, and top tokens — three interactive charts.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    largeIcon: (
      <svg className="h-32 w-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    span: '',
    gradient: 'bg-gradient-to-br from-purple-600/15 via-purple-500/5 to-transparent',
    iconAccent: 'text-purple-400/30 group-hover:text-purple-400/50',
    glow: 'shadow-purple-500/5',
  },
  {
    title: 'Transaction Ledger',
    description:
      'Full table with sortable columns, category filters, address search, and CSV export — all your data, organized.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    largeIcon: (
      <svg className="h-32 w-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    span: 'sm:col-span-2',
    gradient: 'bg-gradient-to-br from-amber-600/15 via-amber-500/5 to-transparent',
    iconAccent: 'text-amber-400/30 group-hover:text-amber-400/50',
    glow: 'shadow-amber-500/5',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Enter Address',
    description: 'Paste any Ethereum address or ENS name into the search bar.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'View Profile',
    description: 'See the full wallet profile — balance, badges, activity, and history.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Explore Data',
    description: 'Dive into charts, filter transactions, and export CSV data.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-8 4 4 5-10" />
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: 'Do I need to connect a wallet to use this?',
    a: 'No. You can search any Ethereum address or ENS name without connecting. Connecting your wallet simply auto-navigates to your own profile.',
  },
  {
    q: 'Is this using real blockchain data?',
    a: 'Yes — all data is fetched live from the Sepolia testnet via Alchemy Enhanced APIs. Balances, transactions, and NFTs are all real on-chain data.',
  },
  {
    q: 'Why Sepolia testnet instead of mainnet?',
    a: 'This is a portfolio project built for demonstration. Sepolia provides the same data structures as mainnet without financial risk.',
  },
  {
    q: 'What wallet badges are available?',
    a: 'Wallets are classified as Whale (high ETH), NFT Collector (35%+ NFT activity), DeFi Degen (40%+ ERC-20), New User (under 20 TXs), or Regular User.',
  },
  {
    q: 'Can I export transaction data?',
    a: 'Yes. The transactions page includes CSV export with timestamps, values, addresses, and hashes.',
  },
];

export default function LandingAbout() {
  return (
    <>
      {/* ─── Tools for the Chain ─── bg matches footer (bg-gray-900) */}
      <section id="about" className="w-full bg-gray-900 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4">
            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-700">
              Your Analytics Suite
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              Tools for the Chain
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-gray-400">
              Everything you need to understand any wallet&apos;s on-chain footprint.
            </p>
          </div>

          {/* Bento grid */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`card-hover group relative overflow-hidden rounded-2xl border border-gray-800 ${f.gradient} p-6 shadow-md ${f.glow} transition-all hover:border-gray-700 ${f.span}`}
              >
                {/* Large decorative icon — highlighted, bottom-right */}
                <div className={`pointer-events-none absolute -bottom-4 -right-4 transition-all duration-500 ${f.iconAccent}`}>
                  {f.largeIcon}
                </div>

                {/* Icon pill */}
                <div className="mb-4 inline-flex items-center justify-center rounded-lg border border-gray-800 bg-gray-800 p-2.5 text-blue-400">
                  {f.icon}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-100">{f.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-400">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Operational Workflow ─── same header layout as Tools */}
      <section className="w-full border-t border-gray-800/50 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4">
            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-700">
              Get Started
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              Operational Workflow
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-gray-400">
              Three steps. No wallet connection required.
            </p>
          </div>

          <div className="relative mt-10 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-3">
            {/* Connecting line — desktop only */}
            <div className="pointer-events-none absolute top-8 left-[16.66%] right-[16.66%] hidden h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent sm:block" />

            {STEPS.map((s) => (
              <div key={s.step} className="relative flex flex-col items-center gap-4 text-center">
                <div className="glow-accent relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <span className="text-lg font-bold">{s.step}</span>
                </div>
                <div className="text-gray-500">{s.icon}</div>
                <h3 className="text-base font-semibold text-gray-100">{s.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-gray-400">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ─── bg matches footer */}
      <section className="w-full bg-gray-900 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="gradient-border rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center shadow-md shadow-black/5">
            <h3 className="text-lg font-semibold text-gray-100">Built with</h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {['Next.js 14', 'Tailwind CSS', 'Alchemy SDK', 'Recharts', 'ethers.js'].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-gray-700 bg-gray-800 px-5 py-2 text-sm font-medium text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-5 max-w-md text-xs text-gray-500">
              100% frontend. Read-only. Sepolia testnet. No smart contracts deployed.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── heading sticky-left, cards scroll-right */}
      <section className="w-full border-t border-gray-800/50 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-12 sm:flex-row sm:gap-16">
            {/* Left — sticky heading */}
            <div className="shrink-0 sm:sticky sm:top-24 sm:w-72 sm:self-start">
              <span className="text-[11px] font-medium uppercase tracking-widest text-gray-700">
                Support
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Frequently Asked
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Common questions about Wallet Profiler and how it works.
              </p>
            </div>

            {/* Right — FAQ accordion (only one open at a time) */}
            <FaqAccordion items={FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
