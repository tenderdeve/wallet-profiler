// Direct JSON-RPC fetch instead of alchemy-sdk.
//
// Root cause: alchemy-sdk uses ethers.js v5 internally, which detects a browser-like
// environment in Next.js and uses the global fetch. Next.js overrides global fetch with
// its own caching layer, which corrupts Alchemy's streaming RPC responses (version=web/5.8.0
// error). Using fetch() directly with cache:'no-store' bypasses this entirely.
import config from '../config';
import { TX_CATEGORIES, ALCHEMY_MAX_TRANSFERS } from '../constants';

/**
 * Returns the Alchemy JSON-RPC endpoint URL for the configured chain.
 * config.alchemy.chain is e.g. "eth-sepolia" which maps directly to the subdomain.
 */
function getRpcUrl() {
  return `https://${config.alchemy.chain}.g.alchemy.com/v2/${config.alchemy.apiKey}`;
}

/**
 * Executes a single `alchemy_getAssetTransfers` JSON-RPC call.
 * Uses native fetch with cache:'no-store' so Next.js never caches live chain data.
 *
 * @param {Object} params - alchemy_getAssetTransfers params object
 * @returns {Promise<{ transfers: Array, pageKey: string|undefined }>}
 */
async function fetchAssetTransfers(params) {
  const res = await fetch(getRpcUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: [params],
    }),
    cache: 'no-store', // never cache — blockchain data changes every block
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Alchemy HTTP ${res.status}: ${body}`);
  }

  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? 'Alchemy RPC error');
  return json.result;
}

/**
 * Fetches asset transfers for a wallet address.
 * Abstracts all Alchemy calls — components never call the API directly.
 *
 * @param {Object} params
 * @param {string} params.address
 * @param {'from'|'to'} [params.direction='from']
 * @param {number} [params.maxCount=50]
 * @param {string} [params.pageKey]
 * @param {string[]} [params.category]
 * @returns {Promise<{ transfers: Array, pageKey: string|undefined }>}
 */
export async function getTransfers({
  address,
  direction = 'from',
  maxCount = ALCHEMY_MAX_TRANSFERS,
  pageKey,
  category = Object.values(TX_CATEGORIES),
}) {
  const result = await fetchAssetTransfers({
    [direction === 'from' ? 'fromAddress' : 'toAddress']: address,
    category,
    maxCount: `0x${maxCount.toString(16)}`, // Alchemy RPC requires hex string, not a plain number
    withMetadata: true,
    order: 'desc',
    ...(pageKey ? { pageKey } : {}),
  });

  return {
    transfers: result.transfers,
    pageKey: result.pageKey,
  };
}

/**
 * Fetches the earliest inbound transfer — used to calculate wallet age.
 *
 * @param {string} address
 * @returns {Promise<string|null>} ISO timestamp, or null
 */
export async function getFirstTransferTimestamp(address) {
  const result = await fetchAssetTransfers({
    toAddress: address,
    fromBlock: '0x0',
    maxCount: '0x1', // hex required by Alchemy RPC
    order: 'asc',
    withMetadata: true,
    category: Object.values(TX_CATEGORIES),
  });

  return result.transfers[0]?.metadata?.blockTimestamp ?? null;
}
