/**
 * Validates required environment variables at startup.
 * Throws a clear error immediately if anything is missing
 * rather than failing silently at runtime.
 */

// Next.js replaces NEXT_PUBLIC_ vars via static string substitution at build time.
// Bracket notation (process.env[variable]) does NOT get substituted in client bundles.
// Each var must be referenced with literal dot notation for the replacement to work.
const ENV = {
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
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
    apiKey: ENV.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chain: ENV.NEXT_PUBLIC_CHAIN,
  },
};

export default config;
