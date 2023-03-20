/**
 * In-flight request deduplication for fetch calls.
 * If the same URL is requested while a previous request is still pending,
 * returns the same promise instead of firing a duplicate HTTP request.
 *
 * Used by useActivityFeed and useWalletProfile to avoid redundant
 * /api/transfers calls when both hooks mount simultaneously on the profile page.
 */

const inflight = new Map();

export function dedupedFetch(url) {
  if (inflight.has(url)) return inflight.get(url);

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .finally(() => {
      // Clear after response so subsequent navigations get fresh data
      setTimeout(() => inflight.delete(url), 100);
    });

  inflight.set(url, promise);
  return promise;
}
