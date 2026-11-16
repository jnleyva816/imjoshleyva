import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";

let ipCounter = 0;

function request({ method = "POST", body = {}, origin, ip } = {}) {
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

test("accepts same-origin posts up to validation", async () => {
  const res = await send({ body: valid, origin: "https://imjoshleyva.vercel.app" });
  assert.equal(res.statusCode, 500, "reaches the config check");
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
