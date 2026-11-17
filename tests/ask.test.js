import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import handler, { provider, systemPrompt } from "../api/ask.js";

const realFetch = globalThis.fetch;
const KEYS = ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "ASK_MODEL", "UPSTASH_REDIS_REST_URL", "KV_REST_API_URL"];
let saved;
let ipCounter = 0;

beforeEach(() => {
  saved = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));
  for (const key of KEYS) delete process.env[key];
});

afterEach(() => {
  globalThis.fetch = realFetch;
  for (const [key, value] of Object.entries(saved)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function call({ method = "POST", body = {}, headers = {} } = {}) {
  ipCounter += 1;
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  const req = { method, body, headers: { host: "joshleyva.dev", "x-forwarded-for": `192.0.2.${ipCounter}`, ...headers } };
  return handler(req, res).then(() => res);
}

test("reports whether it is configured", async () => {
  assert.deepEqual((await call({ method: "GET" })).body, { configured: false });
  process.env.OPENAI_API_KEY = "sk-test";
  assert.deepEqual((await call({ method: "GET" })).body, { configured: true });
});

test("prefers Anthropic when both keys are set", () => {
  assert.equal(provider({ ANTHROPIC_API_KEY: "a", OPENAI_API_KEY: "b" }), "anthropic");
  assert.equal(provider({ OPENAI_API_KEY: "b" }), "openai");
  assert.equal(provider({}), null);
});

test("is off without a key", async () => {
  assert.equal((await call({ body: { question: "Where does Josh work?" } })).statusCode, 503);
});

test("rejects empty questions and other origins", async () => {
  process.env.ANTHROPIC_API_KEY = "test";
  assert.equal((await call({ body: { question: " " } })).statusCode, 400);
  assert.equal((await call({ body: { question: "hi there" }, headers: { origin: "https://evil.example" } })).statusCode, 403);
});

test("grounds the model in the site and returns its answer", async () => {
  process.env.ANTHROPIC_API_KEY = "test";
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body), headers: init.headers };
    return new Response(JSON.stringify({ content: [{ type: "text", text: " Josh is a Senior Solutions Engineer at Cryptio. " }] }));
  };
  const res = await call({ body: { question: "Where does Josh work?".padEnd(400, "?") } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.answer, "Josh is a Senior Solutions Engineer at Cryptio.");
  assert.equal(sent.url, "https://api.anthropic.com/v1/messages");
  assert.equal(sent.headers["x-api-key"], "test");
  assert.match(sent.body.system, /Cryptio/);
  assert.equal(sent.body.messages[0].content.length, 300);
});

test("talks to OpenAI when that is the key", async () => {
  process.env.OPENAI_API_KEY = "sk-test";
  process.env.ASK_MODEL = "some-model";
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body) };
    return new Response(JSON.stringify({ choices: [{ message: { content: "He studied at Florida Poly." } }] }));
  };
  const res = await call({ body: { question: "Where did he study?" } });
  assert.equal(res.body.answer, "He studied at Florida Poly.");
  assert.equal(sent.url, "https://api.openai.com/v1/chat/completions");
  assert.equal(sent.body.model, "some-model");
  assert.equal(sent.body.messages[0].role, "system");
});

test("a failed model call is a 502, not a crash", async () => {
  process.env.ANTHROPIC_API_KEY = "test";
  globalThis.fetch = async () => new Response("nope", { status: 529 });
  const original = console.error;
  console.error = () => {};
  try {
    assert.equal((await call({ body: { question: "Anything?" } })).statusCode, 502);
  } finally {
    console.error = original;
  }
});

test("limits one visitor to ten questions an hour", async () => {
  process.env.ANTHROPIC_API_KEY = "test";
  globalThis.fetch = async () => new Response(JSON.stringify({ content: [{ type: "text", text: "ok" }] }));
  const codes = [];
  for (let i = 0; i < 11; i += 1) {
    const res = await call({ body: { question: "Same person asking" }, headers: { "x-forwarded-for": "198.51.100.200" } });
    codes.push(res.statusCode);
  }
  assert.equal(codes[9], 200);
  assert.equal(codes[10], 429);
});

test("the prompt keeps the visitor's text out of the instructions", () => {
  const prompt = systemPrompt();
  assert.match(prompt, /Use only the facts in <site>/);
  assert.match(prompt, /## Work/);
});
