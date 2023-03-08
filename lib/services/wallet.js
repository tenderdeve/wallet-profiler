// Direct JSON-RPC fetch for ETH balance and TX count.
// ENS lookup uses ethers JsonRpcProvider (server-only — gracefully returns null on failure).
//
// Root cause of rewrite: alchemy-sdk uses ethers.js v5 internally, which runs in "web" mode
// inside Next.js and corrupts RPC responses (same issue fixed in transfers.js on Day 2).
import { formatEther, JsonRpcProvider } from 'ethers';
import config from '../config';

function getRpcUrl() {
  return `https://${config.alchemy.chain}.g.alchemy.com/v2/${config.alchemy.apiKey}`;
}

async function rpcCall(method, params) {
  const res = await fetch(getRpcUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Alchemy HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? 'RPC error');
  return json.result;
}

/**
 * Fetches ETH balance for a wallet address.
 *
 * @param {string} address
 * @returns {Promise<string>} Formatted ETH balance rounded to 4 decimal places
 */
export async function getEthBalance(address) {
  const hex = await rpcCall('eth_getBalance', [address, 'latest']);
  return parseFloat(formatEther(BigInt(hex))).toFixed(4);
}

/**
 * Fetches total transaction count (nonce) for an address.
 *
 * @param {string} address
 * @returns {Promise<number>}
 */
export async function getTransactionCount(address) {
  const hex = await rpcCall('eth_getTransactionCount', [address, 'latest']);
  return parseInt(hex, 16);
}

/**
 * Reverse-resolves an Ethereum address to its ENS name.
 * Returns null if no ENS name is set or if the lookup fails.
 * ENS reverse lookup on Sepolia will return null for most addresses.
 *
 * @param {string} address
 * @returns {Promise<string|null>}
 */
export async function lookupEnsName(address) {
  try {
    const provider = new JsonRpcProvider(getRpcUrl());
    return await provider.lookupAddress(address);
  } catch {
    return null;
  }
}

/**
 * Resolves an ENS name to an Ethereum address.
 * Returns null if the name cannot be resolved.
 *
 * @param {string} ensName - e.g. "vitalik.eth"
 * @returns {Promise<string|null>}
 */
export async function resolveEnsName(ensName) {
  try {
    const provider = new JsonRpcProvider(getRpcUrl());
    return await provider.resolveName(ensName);
  } catch {
    return null;
  }
}
