import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import writing, { parseFeed } from "../api/writing.js";
import running, { summarize } from "../api/running.js";

const realFetch = globalThis.fetch;
const env = { ...process.env };

afterEach(() => {
  globalThis.fetch = realFetch;
  process.env = { ...env };
});

function response() {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.setHeader = (key, value) => (res.headers[key.toLowerCase()] = value);
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (data) => ((res.body = data), res);
  return res;
}

const FEED = `<?xml version="1.0"?><rss><channel><title><![CDATA[Joshua Leyva]]></title>
<item><title><![CDATA[Notes on SQL &amp; support]]></title><link>https://joshualeyva.substack.com/p/sql</link><pubDate>Mon, 16 Nov 2026 14:00:00 GMT</pubDate></item>
<item><title>Second</title><link>https://joshualeyva.substack.com/p/two</link><pubDate>not a date</pubDate></item>
<item><title>Sneaky</title><link>javascript:alert(1)</link></item>
<item><title>Third</title><link>https://joshualeyva.substack.com/p/three</link></item>
<item><title>Fourth</title><link>https://joshualeyva.substack.com/p/four</link></item>
</channel></rss>`;

test("parseFeed reads titles, links, and dates, and decodes entities", () => {
  const posts = parseFeed(FEED);
  assert.equal(posts.length, 3);
  assert.deepEqual(posts[0], {
    title: "Notes on SQL & support",
    url: "https://joshualeyva.substack.com/p/sql",
    date: "2026-11-16T14:00:00.000Z",
  });
  assert.equal(posts[1].date, null);
});

test("parseFeed drops links that are not https", () => {
  assert.ok(parseFeed(FEED, 10).every((post) => post.url.startsWith("https://")));
});

test("parseFeed handles a feed with no posts", () => {
  assert.deepEqual(parseFeed("<rss><channel><title>x</title></channel></rss>"), []);
});

test("writing returns posts and caches them at the edge", async () => {
  globalThis.fetch = async () => new Response(FEED, { status: 200 });
  const res = response();
  await writing({ method: "GET" }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.posts.length, 3);
  assert.match(res.headers["cache-control"], /s-maxage=3600/);
});

test("writing returns an empty list when Substack is down", async () => {
  globalThis.fetch = async () => new Response("nope", { status: 503 });
  const res = response();
  await writing({ method: "GET" }, res);
  assert.deepEqual(res.body, { posts: [] });
});

test("running stays quiet until Strava is configured", async () => {
  delete process.env.STRAVA_CLIENT_ID;
  let called = false;
  globalThis.fetch = async () => ((called = true), new Response("{}"));
  const res = response();
  await running({ method: "GET" }, res);
  assert.deepEqual(res.body, { configured: false });
  assert.equal(called, false);
});

test("running refreshes the token and reports miles", async () => {
  Object.assign(process.env, {
    STRAVA_CLIENT_ID: "1",
    STRAVA_CLIENT_SECRET: "s",
    STRAVA_REFRESH_TOKEN: "r",
  });
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.KV_REST_API_URL;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push(String(url));
    if (String(url).includes("oauth/token")) {
      assert.equal(JSON.parse(options.body).refresh_token, "r");
      return Response.json({ access_token: "a", expires_at: Date.now() / 1000 + 3600, refresh_token: "r" });
    }
    assert.equal(options.headers.Authorization, "Bearer a");
    return Response.json({
      recent_run_totals: { count: 18, distance: 228526.8, moving_time: 75600 },
      ytd_run_totals: { count: 160, distance: 1931212.8, moving_time: 640000 },
    });
  };
  const res = response();
  await running({ method: "GET" }, res);
  assert.equal(res.body.configured, true);
  assert.deepEqual(res.body.recent, { runs: 18, miles: 142, hours: 21 });
  assert.equal(res.body.year.miles, 1200);
  assert.equal(calls.length, 2);
});

test("summarize copes with missing totals", () => {
  assert.deepEqual(summarize({}).recent, { runs: 0, miles: 0, hours: 0 });
});
