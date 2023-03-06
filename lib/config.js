/**
 * Validates required environment variables at startup.
 * Throws a clear error immediately if anything is missing
 * rather than failing silently at runtime.
 */

// ALCHEMY_API_KEY has no NEXT_PUBLIC_ prefix — Next.js never bundles it into client code.
// NEXT_PUBLIC_CHAIN is non-sensitive ("eth-sepolia") and may remain public.
// Each var is read with literal dot notation; bracket notation fails for NEXT_PUBLIC_ substitution.
const ENV = {
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  NEXT_PUBLIC_CHAIN: process.env.NEXT_PUBLIC_CHAIN,
};

function validateConfig() {
  const missing = Object.entries(ENV)
    .filter(([, value]) => !value || value.trim() === '')
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n` +
        'Copy .env_example to .env.local and fill in the values.'
    );
  }
}

validateConfig();

const config = {
  alchemy: {
    apiKey: ENV.ALCHEMY_API_KEY, // server-only — never reaches the browser
    chain: ENV.NEXT_PUBLIC_CHAIN,
  },
};

export default config;
