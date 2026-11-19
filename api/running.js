// Running totals from Strava for the "Lately" block. Stays quiet (returns
// { configured: false }) until STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and
// STRAVA_REFRESH_TOKEN are set. Cached at the edge for 30 minutes.

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ATHLETE_ID = process.env.STRAVA_ATHLETE_ID || "147050581";
const METERS_PER_MILE = 1609.344;

let access = { token: "", expiresAt: 0 };
let refreshToken = "";

// Strava can rotate the refresh token. With Upstash configured the newest one
// is kept there; otherwise the environment variable is used each cold start.
function redis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function storedRefreshToken() {
  const store = redis();
  if (!store) return "";
  try {
    const response = await fetch(`${store.url}/get/strava:refresh`, {
      headers: { Authorization: `Bearer ${store.token}` },
      signal: AbortSignal.timeout(3000),
    });
    return (await response.json()).result || "";
  } catch {
    return "";
  }
}

async function storeRefreshToken(value) {
  const store = redis();
  if (!store) return;
  try {
    // The token goes in the body, not the URL, so it stays out of request logs.
    const response = await fetch(store.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${store.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["SET", "strava:refresh", value]),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`upstash_${response.status}`);
  } catch (error) {
    console.error("running: could not store refresh token", error);
  }
}

async function accessToken() {
  if (access.token && access.expiresAt - 60 > Date.now() / 1000) return access.token;

  refreshToken ||= (await storedRefreshToken()) || process.env.STRAVA_REFRESH_TOKEN;
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`strava_token_${response.status}`);
  const data = await response.json();
  access = { token: data.access_token, expiresAt: data.expires_at };
  if (data.refresh_token && data.refresh_token !== refreshToken) {
    refreshToken = data.refresh_token;
    await storeRefreshToken(refreshToken);
  }
  return access.token;
}

const totals = (block = {}) => ({
  runs: block.count ?? 0,
  miles: Math.round(((block.distance ?? 0) / METERS_PER_MILE) * 10) / 10,
  hours: Math.round(((block.moving_time ?? 0) / 3600) * 10) / 10,
});

/** Strava's athlete stats, reduced to what the page shows. */
export function summarize(stats) {
  return { recent: totals(stats.recent_run_totals), year: totals(stats.ytd_run_totals) };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ configured: false });
  }

  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;
  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
    res.setHeader("Cache-Control", "public, s-maxage=3600");
    return res.status(200).json({ configured: false });
  }

  try {
    const response = await fetch(`https://www.strava.com/api/v3/athletes/${ATHLETE_ID}/stats`, {
      headers: { Authorization: `Bearer ${await accessToken()}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`strava_stats_${response.status}`);
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json({ configured: true, ...summarize(await response.json()) });
  } catch (error) {
    console.error("running: Strava unavailable", error);
    access = { token: "", expiresAt: 0 };
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.status(200).json({ configured: true, recent: null, year: null });
  }
}
