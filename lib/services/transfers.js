import { alchemy } from '../alchemy';
import { TX_CATEGORIES } from '../constants';

/**
 * Fetches asset transfers for a wallet address.
 * Abstracts all Alchemy SDK calls — components never call the SDK directly.
 *
 * @param {Object} params
 * @param {string} params.address - Wallet address (fromAddress or toAddress)
 * @param {'from'|'to'} [params.direction='from']
 * @param {number} [params.maxCount=50]
 * @param {string} [params.pageKey] - For pagination
 * @param {string[]} [params.category] - TX categories to include
 * @returns {Promise<{ transfers: Array, pageKey: string|undefined }>}
 */
export async function getTransfers({
  address,
  direction = 'from',
  maxCount = 50,
  pageKey,
  category = Object.values(TX_CATEGORIES),
}) {
  const params = {
    [direction === 'from' ? 'fromAddress' : 'toAddress']: address,
    category,
    maxCount,
    withMetadata: true,
    order: 'desc',
    ...(pageKey ? { pageKey } : {}),
  };

  const response = await alchemy.core.getAssetTransfers(params);

  return {
    transfers: response.transfers,
    pageKey: response.pageKey,
  };
}

/**
 * Fetches the earliest inbound transfer for a wallet — used to determine wallet age.
 *
 * @param {string} address
 * @returns {Promise<string|null>} ISO timestamp of the first transaction, or null
 */
export async function getFirstTransferTimestamp(address) {
  const response = await alchemy.core.getAssetTransfers({
    toAddress: address,
    fromBlock: '0x0',
    maxCount: 1,
    order: 'asc',
    withMetadata: true,
    category: Object.values(TX_CATEGORIES),
  });

  return response.transfers[0]?.metadata?.blockTimestamp ?? null;
}
