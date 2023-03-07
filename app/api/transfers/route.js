// Server-side proxy — keeps ALCHEMY_API_KEY out of the client bundle.
// Client hooks call this route; this route calls the Alchemy service.
import { isAddress } from 'ethers';
import { getTransfers } from '@/lib/services/transfers';

/**
 * GET /api/transfers?address=0x...&direction=from|to&pageKey=...
 *
 * Returns { transfers: AssetTransfer[], pageKey: string | undefined }
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const direction = searchParams.get('direction') ?? 'from';
  const pageKey = searchParams.get('pageKey') ?? undefined;

  // Validate inputs before touching Alchemy.
  if (!address || !isAddress(address)) {
    return Response.json({ error: 'Invalid address' }, { status: 400 });
  }

  if (direction !== 'from' && direction !== 'to') {
    return Response.json({ error: 'Invalid direction' }, { status: 400 });
  }

  try {
    const result = await getTransfers({ address, direction, pageKey });
    return Response.json(result);
  } catch {
    // Never expose internal error details — return a generic message.
    return Response.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}
