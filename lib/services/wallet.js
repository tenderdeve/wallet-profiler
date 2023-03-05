import { ethers } from 'ethers';
import { alchemy } from '../alchemy';

/**
 * Fetches ETH balance for a wallet address.
 *
 * @param {string} address
 * @returns {Promise<string>} Formatted ETH balance rounded to 4 decimal places
 */
export async function getEthBalance(address) {
  const raw = await alchemy.core.getBalance(address, 'latest');
  return parseFloat(ethers.formatEther(raw)).toFixed(4);
}

/**
 * Fetches total transaction count (nonce) for an address.
 *
 * @param {string} address
 * @returns {Promise<number>}
 */
export async function getTransactionCount(address) {
  return alchemy.core.getTransactionCount(address);
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
    return await alchemy.core.resolveName(ensName);
  } catch {
    return null;
  }
}

/**
 * Reverse-resolves an Ethereum address to its ENS name.
 * Returns null if no ENS name is set.
 *
 * @param {string} address
 * @returns {Promise<string|null>}
 */
export async function lookupEnsName(address) {
  try {
    return await alchemy.core.lookupAddress(address);
  } catch {
    return null;
  }
}
