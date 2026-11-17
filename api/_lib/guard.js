// Shared by the api/ functions. Vercel doesn't deploy files under api/_lib
// as endpoints.

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return (
    (typeof forwarded === "string" && forwarded.split(",")[0].trim()) ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

async function countInRedis(key, windowSeconds) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
      ]),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`upstash_${response.status}`);
    const [incr] = await response.json();
    return Number(incr.result);
  } catch (error) {
    console.error("rate limit store unavailable", error);
    return null;
  }
}

/**
 * `limit(ip)` is true once an address has made more than `max` requests in
 * the window. Counts live in Upstash Redis when it's configured; otherwise in
 * this instance's memory, which slows a script down but isn't a global limit.
 */
export function rateLimit(prefix, { max, windowSeconds }) {
  const recent = new Map();

  function countInMemory(key) {
    const now = Date.now();
    if (recent.size > 1000) {
      for (const [k, v] of recent) if (v.resetAt <= now) recent.delete(k);
    }
    const entry = recent.get(key);
    if (!entry || entry.resetAt <= now) {
      recent.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      return 1;
    }
    entry.count += 1;
    return entry.count;
  }

  return async function limit(ip) {
    const key = `${prefix}:${ip}`;
    const count = (await countInRedis(key, windowSeconds)) ?? countInMemory(key);
    return count > max;
  };
}
