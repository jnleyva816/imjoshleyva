import { test } from "node:test";
import assert from "node:assert/strict";
import handler, { normalize } from "../api/csp-report.js";

function call(body, { method = "POST", ip = "203.0.113.9" } = {}) {
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end() {
      return this;
    },
  };
  return handler({ method, body, headers: { "x-forwarded-for": ip } }, res).then(() => res);
}

test("reads the Reporting API format", () => {
  const [report] = normalize([
    {
      type: "csp-violation",
      body: { effectiveDirective: "require-trusted-types-for", blockedURL: "trusted-types-sink", documentURL: "https://joshleyva.dev/", sample: "Element innerHTML|<b>", disposition: "report", lineNumber: 4 },
    },
  ]);
  assert.equal(report.directive, "require-trusted-types-for");
  assert.equal(report.disposition, "report");
  assert.equal(report.line, 4);
});

test("reads the older report-uri format", () => {
  const [report] = normalize({ "csp-report": { "violated-directive": "script-src", "blocked-uri": "https://evil.example/x.js", "document-uri": "https://joshleyva.dev/" } });
  assert.equal(report.directive, "script-src");
  assert.equal(report.blocked, "https://evil.example/x.js");
});

test("ignores other report types and trims long fields", () => {
  assert.deepEqual(normalize([{ type: "deprecation", body: {} }]), []);
  const [report] = normalize({ "csp-report": { "violated-directive": "x".repeat(5000) } });
  assert.equal(report.directive.length, 200);
});

test("answers 204, rejects bad JSON and other methods", async () => {
  const original = console.warn;
  console.warn = () => {};
  try {
    assert.equal((await call(JSON.stringify({ "csp-report": { "violated-directive": "img-src" } }), { ip: "198.51.100.1" })).statusCode, 204);
    assert.equal((await call("{nope", { ip: "198.51.100.2" })).statusCode, 400);
    assert.equal((await call(undefined, { method: "GET" })).statusCode, 405);
  } finally {
    console.warn = original;
  }
});

test("rate limits a noisy address", async () => {
  const original = console.warn;
  console.warn = () => {};
  try {
    const codes = [];
    for (let i = 0; i < 32; i += 1) codes.push((await call({ "csp-report": {} }, { ip: "198.51.100.77" })).statusCode);
    assert.equal(codes[29], 204);
    assert.equal(codes[30], 429);
  } finally {
    console.warn = original;
  }
});
