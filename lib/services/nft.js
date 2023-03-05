import { alchemy } from '../alchemy';

/**
 * Fetches the count of NFTs owned by an address.
 *
 * @param {string} address
 * @returns {Promise<number>}
 */
export async function getNftCount(address) {
  const response = await alchemy.nft.getNftsForOwner(address);
  return response.ownedNfts.length;
}
