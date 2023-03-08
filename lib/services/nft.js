// Direct Alchemy NFT REST API v3 fetch — no alchemy-sdk dependency.
// Same reason as wallet.js and transfers.js: alchemy-sdk's ethers.js v5 runs in
// "web" mode inside Next.js and corrupts RPC responses.
import config from '../config';

/**
 * Fetches the total number of NFTs owned by an address.
 * Uses Alchemy NFT API v3 with pageSize=1 to get only the totalCount.
 *
 * @param {string} address
 * @returns {Promise<number>}
 */
export async function getNftCount(address) {
  const url = [
    `https://${config.alchemy.chain}.g.alchemy.com`,
    `/nft/v3/${config.alchemy.apiKey}/getNFTsForOwner`,
    `?owner=${encodeURIComponent(address)}&withMetadata=false&pageSize=1`,
  ].join('');

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Alchemy NFT API ${res.status}`);

  const json = await res.json();
  return json.totalCount ?? 0;
}
