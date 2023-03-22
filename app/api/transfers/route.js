// Server-side proxy — keeps ALCHEMY_API_KEY out of the client bundle.
import { isAddress } from 'ethers';
import { getTransfers } from '@/lib/services/transfers';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * GET /api/transfers?address=0x...&direction=from|to&pageKey=...
 *
 * Returns { transfers: AssetTransfer[], pageKey: string | undefined }
 */
export async function GET(request) {
  const { allowed } = checkRateLimit(request);
  if (!allowed) return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });

  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const direction = searchParams.get('direction') ?? 'from';
  const rawPageKey = searchParams.get('pageKey');
  // Validate pageKey — must be base64-like, 4–256 chars, decodable
  let pageKey;
  if (rawPageKey && typeof rawPageKey === 'string' && rawPageKey.length >= 4 && rawPageKey.length <= 256 && /^[a-zA-Z0-9+/=_\-]+$/.test(rawPageKey)) {
    try {
      atob(rawPageKey.replace(/-/g, '+').replace(/_/g, '/'));
      pageKey = rawPageKey;
    } catch {
      pageKey = undefined;
    }
  }
  const maxCountParam = searchParams.get('maxCount');

  // Validate inputs before touching Alchemy.
  if (!address || !isAddress(address)) {
    return Response.json({ error: 'Invalid address' }, { status: 400 });
  }

  if (direction !== 'from' && direction !== 'to') {
    return Response.json({ error: 'Invalid direction' }, { status: 400 });
  }

  // Optional maxCount — clamped to 1–200 to prevent abuse.
  let maxCount;
  if (maxCountParam) {
    const parsed = parseInt(maxCountParam, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 200) {
      return Response.json({ error: 'Invalid maxCount' }, { status: 400 });
    }
    maxCount = parsed;
  }

  try {
    const result = await getTransfers({ address, direction, pageKey, ...(maxCount ? { maxCount } : {}) });
    return Response.json(result);
  } catch {
    // Never expose internal error details — return a generic message.
    return Response.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}
