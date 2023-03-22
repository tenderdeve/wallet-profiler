// Server-side proxy — keeps ALCHEMY_API_KEY out of the client bundle.
import { isAddress } from 'ethers';
import { getEthBalance, getTransactionCount, lookupEnsName } from '@/lib/services/wallet';
import { getFirstTransferTimestamp } from '@/lib/services/transfers';
import { getNftCount } from '@/lib/services/nft';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * GET /api/wallet?address=0x...
 *
 * Returns { balance, txCount, ensName, firstTxTimestamp, nftCount }
 *
 * FIX 2 — Promise.allSettled so one failing service never crashes the full response.
 * Each field independently returns null on failure; the client renders '--' for null values.
 */
export async function GET(request) {
  const { allowed } = checkRateLimit(request);
  if (!allowed) return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address || !isAddress(address)) {
    return Response.json({ error: 'Invalid address' }, { status: 400 });
  }

  // FIX 2 — allSettled so getEthBalance or getTransactionCount failing doesn't return a 500 for all fields
  const results = await Promise.allSettled([
    getEthBalance(address),
    getTransactionCount(address),
    lookupEnsName(address),
    getFirstTransferTimestamp(address),
    getNftCount(address),
  ]);

  // FIX 2 — extract each settled result; rejected promises produce null rather than an error response
  const balance        = results[0].status === 'fulfilled' ? results[0].value : null;
  const txCount        = results[1].status === 'fulfilled' ? results[1].value : null;
  const ensName        = results[2].status === 'fulfilled' ? results[2].value : null;
  const firstTxTimestamp = results[3].status === 'fulfilled' ? results[3].value : null;
  const nftCount       = results[4].status === 'fulfilled' ? results[4].value : null;

  return Response.json({ balance, txCount, ensName, firstTxTimestamp, nftCount });
}
