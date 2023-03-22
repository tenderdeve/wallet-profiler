/**
 * Landing page About section — explains what Wallet Profiler does.
 * Server Component — purely presentational, no interactivity.
 */

const FEATURES = [
  {
    title: 'Activity Feed',
    description:
      'See every transaction in a clean, Twitter-style feed. Sends, receives, NFT mints, and token transfers — all labeled and timestamped.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    color: 'text-blue-400 bg-blue-500/10',
  },
  {
    title: 'Wallet Identity',
    description:
      'Instant profile with ENS name, ETH balance, NFT count, and wallet age. A personality badge classifies each wallet — Whale, DeFi Degen, NFT Collector, and more.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    color: 'text-green-400 bg-green-500/10',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Three interactive charts built with Recharts: monthly activity trends, transaction type breakdown, and top tokens by volume.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: 'text-purple-400 bg-purple-500/10',
  },
  {
    title: 'Transaction Table',
    description:
      'Full-page table view with sortable columns, category filters, address search, and CSV export. All the data, in one organized view.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M12 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M21 12c0 .621-.504 1.125-1.125 1.125m-5.25 0c.621 0 1.125.504 1.125 1.125m-12.75-1.125c-.621 0-1.125.504-1.125 1.125" />
      </svg>
    ),
    color: 'text-amber-400 bg-amber-500/10',
  },
];

const STEPS = [
  { step: '1', text: 'Enter any Ethereum address or ENS name' },
  { step: '2', text: 'View the full wallet profile — balance, badges, and history' },
  { step: '3', text: 'Explore charts, filter transactions, and export data' },
];

export default function LandingAbout() {
  return (
    <section id="about" className="w-full bg-gray-900/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
            Everything you need to understand a wallet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-400">
            Wallet Profiler gives you a complete picture of any Ethereum wallet&apos;s on-chain activity — all from one search.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-700"
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-gray-400">
            Three steps. No wallet connection required.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {s.step}
              </div>
              <p className="text-sm leading-relaxed text-gray-300">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="mt-20 rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-100">Built with</h3>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            {['Next.js 14', 'Tailwind CSS', 'Alchemy SDK', 'Recharts', 'ethers.js'].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-700 bg-gray-800 px-4 py-1.5 text-xs font-medium text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-md text-xs text-gray-500">
            100% frontend. Read-only. Sepolia testnet. No smart contracts deployed.
          </p>
        </div>
      </div>
    </section>
  );
}
