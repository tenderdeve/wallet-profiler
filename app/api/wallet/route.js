// Server-side proxy — keeps ALCHEMY_API_KEY out of the client bundle.
// Client hooks call this route; this route calls the wallet and NFT services.
import { isAddress } from 'ethers';
import { getEthBalance, getTransactionCount, lookupEnsName } from '@/lib/services/wallet';
import { getFirstTransferTimestamp } from '@/lib/services/transfers';
import { getNftCount } from '@/lib/services/nft';

/**
 * GET /api/wallet?address=0x...
 *
 * Returns { balance, txCount, ensName, firstTxTimestamp, nftCount }
 *
 * Non-critical fields (ensName, firstTxTimestamp, nftCount) use individual
 * .catch() fallbacks so a failed ENS lookup never blocks the full response.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address || !isAddress(address)) {
    return Response.json({ error: 'Invalid address' }, { status: 400 });
  }

  try {
    const [balance, txCount, ensName, firstTxTimestamp, nftCount] = await Promise.all([
      getEthBalance(address),
      getTransactionCount(address),
      lookupEnsName(address).catch(() => null),
      getFirstTransferTimestamp(address).catch(() => null),
      getNftCount(address).catch(() => 0),
    ]);

    return Response.json({ balance, txCount, ensName, firstTxTimestamp, nftCount });
  } catch {
    // Never expose internal error details — return a generic message.
    return Response.json({ error: 'Failed to fetch wallet data' }, { status: 500 });
  }
}
