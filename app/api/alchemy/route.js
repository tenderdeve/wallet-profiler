// Server-side API route — Alchemy SDK runs here so ALCHEMY_API_KEY never reaches the browser.
import { resolveEnsName } from '@/lib/services/wallet';

/**
 * GET /api/alchemy?name=vitalik.eth
 *
 * Resolves an ENS name to an Ethereum address.
 * Returns { address: string | null } on success.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  // Validate input before touching Alchemy — must be a non-trivial .eth name.
  if (!name || !name.endsWith('.eth') || name.length <= 4) {
    return Response.json({ error: 'Invalid ENS name' }, { status: 400 });
  }

  try {
    // resolveEnsName already swallows Alchemy errors and returns null on failure.
    const address = await resolveEnsName(name);
    return Response.json({ address });
  } catch {
    // Catch any unexpected errors so the client receives a clean JSON error, not an HTML 500.
    return Response.json({ error: 'ENS resolution failed' }, { status: 500 });
  }
}
