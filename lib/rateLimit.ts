/**
 * Best-effort in-memory rate limit. On serverless hosting each instance has its own memory,
 * so this only slows down casual abuse; a real limit needs a shared store (arrives with the database).
 */
const buckets = new Map<string, number[]>();

/** Returns true if the action is allowed, and records it. */
export function allow(key: string, limit: number, windowMs: number, now = Date.now()) {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
    }
  }
  return true;
}
