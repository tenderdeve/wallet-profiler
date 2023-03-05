/**
 * Validates required environment variables at startup.
 * Throws a clear error immediately if anything is missing
 * rather than failing silently at runtime.
 */

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_ALCHEMY_API_KEY',
  'NEXT_PUBLIC_CHAIN',
];

function validateConfig() {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key] || process.env[key].trim() === ''
  );

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
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chain: process.env.NEXT_PUBLIC_CHAIN,
  },
};

export default config;
