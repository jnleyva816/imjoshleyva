import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";

let ipCounter = 0;

const SELF = "https://imjoshleyva.vercel.app";

function request({ method = "POST", body = {}, origin = SELF, ip } = {}) {
  return {
    method,
    body,
    headers: {
      host: "imjoshleyva.vercel.app",
      ...(origin ? { origin } : {}),
      "x-forwarded-for": ip ?? `203.0.113.${++ipCounter}`,
    },
  };
}

function response() {
  const res = { statusCode: 200, headers: {}, body: undefined };
  res.setHeader = (key, value) => (res.headers[key.toLowerCase()] = value);
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (data) => ((res.body = data), res);
  return res;
}

async function send(options) {
  const res = response();
  await handler(request(options), res);
  return res;
}

const valid = { name: "Ada", email: "ada@example.com", message: "Hello there, Josh." };

beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.KV_REST_API_URL;
  delete process.env.VERCEL_ENV;
});

test("rejects anything but POST", async () => {
  const res = await send({ method: "GET" });
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.allow, "POST");
});

test("rejects cross-origin posts", async () => {
  const res = await send({ body: valid, origin: "https://evil.example" });
  assert.equal(res.statusCode, 403);
});

test("rejects posts with no Origin header, like a bare curl", async () => {
  const res = await send({ body: valid, origin: null });
  assert.equal(res.statusCode, 403);
});

test("accepts same-origin posts up to validation", async () => {
  const res = await send({ body: valid });
  assert.equal(res.statusCode, 500, "reaches the config check");
});

test("production refuses to run without a shared rate-limit store", async () => {
  process.env.VERCEL_ENV = "production";
  const res = await send({ body: valid });
  assert.equal(res.statusCode, 503);
});

test("production fails the Turnstile check when no secret is set", async () => {
  Object.assign(process.env, {
    VERCEL_ENV: "production",
    UPSTASH_REDIS_REST_URL: "https://redis.example",
    UPSTASH_REDIS_REST_TOKEN: "t",
  });
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json([{ result: 1 }, { result: 1 }]);
  try {
    const res = await send({ body: valid });
    assert.equal(res.statusCode, 403);
    assert.match(res.body.message, /Verification/);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  }
});

test("quietly accepts honeypot submissions without sending", async () => {
  const res = await send({ body: { ...valid, _honey: "bot" } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
});

test("validates fields", async () => {
  assert.equal((await send({ body: { ...valid, email: "nope" } })).statusCode, 400);
  assert.equal((await send({ body: { ...valid, message: "short" } })).statusCode, 400);
  assert.equal((await send({ body: { ...valid, name: "   " } })).statusCode, 400);
});

test("reports missing configuration", async () => {
  const res = await send({ body: valid });
  assert.equal(res.statusCode, 500);
  assert.match(res.body.message, /not configured/);
});

test("requires a Turnstile token when a secret is set", async () => {
  process.env.TURNSTILE_SECRET_KEY = "secret";
  const res = await send({ body: valid });
  assert.equal(res.statusCode, 403);
});

test("rate limits a single address", async () => {
  const ip = "198.51.100.7";
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await send({ body: valid, ip })).statusCode);
  assert.deepEqual(codes.slice(0, 5), [500, 500, 500, 500, 500]);
  assert.equal(codes[5], 429);
});

test("sends a fixed auto-reply only when switched on", async (t) => {
  const sent = [];
  const realFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = realFetch;
    delete process.env.CONTACT_AUTOREPLY;
    delete process.env.CONTACT_FROM_EMAIL;
    delete process.env.CONTACT_TO_EMAIL;
  });
  globalThis.fetch = async (url, options) => {
    sent.push(JSON.parse(options.body));
    return Response.json({ id: "x" });
  };
  Object.assign(process.env, { RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "me@example.com" });
  const body = { name: "<b>Spam</b>", email: "them@example.com", message: "Buy things at evil.example now" };

  assert.equal((await send({ body })).statusCode, 200);
  assert.equal(sent.length, 1, "no auto-reply without CONTACT_AUTOREPLY");

  sent.length = 0;
  Object.assign(process.env, { CONTACT_AUTOREPLY: "true", CONTACT_FROM_EMAIL: "Josh <hi@joshleyva.dev>" });
  assert.equal((await send({ body })).statusCode, 200);
  assert.equal(sent.length, 2);
  const reply = sent[1];
  assert.deepEqual(reply.to, ["them@example.com"]);
  assert.equal(reply.reply_to, "me@example.com");
  assert.ok(!JSON.stringify(reply).includes("Spam"));
  assert.ok(!JSON.stringify(reply).includes("evil.example"));
});
