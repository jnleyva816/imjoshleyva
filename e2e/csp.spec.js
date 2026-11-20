import { test, expect } from "@playwright/test";
import fs from "node:fs";

// `vite preview` doesn't send vercel.json headers, so apply the production CSP
// (the rule for the joshleyva.dev host) to our own documents here.
const rules = JSON.parse(fs.readFileSync("vercel.json", "utf8")).headers;
const production = rules.find((rule) => rule.has?.some((condition) => condition.value === "joshleyva.dev"));
const csp = production.headers.find((header) => header.key === "Content-Security-Policy").value;

test("the Content-Security-Policy allows everything the page uses", async ({ page, baseURL }) => {
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.resourceType() !== "document" || !request.url().startsWith(baseURL)) {
      return route.continue();
    }
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": csp } });
  });

  const violations = [];
  await page.exposeFunction("reportViolation", (text) => violations.push(text));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) =>
      window.reportViolation(`${event.violatedDirective} ${event.blockedURI}`),
    );
  });

  await page.goto("/");
  await page.getByRole("button", { name: /^Play / }).click();
  await expect(page.locator("iframe[src*='youtube-nocookie.com']")).toBeAttached();
  await page.waitForLoadState("networkidle");

  expect(violations).toEqual([]);
});

test("production enforces Trusted Types and drops the preview-only hosts", () => {
  expect(csp).toContain("require-trusted-types-for 'script'");
  expect(csp).not.toMatch(/vercel\.live|pusher\.com|fonts\.googleapis/);
});

test("our pages work with Trusted Types enforced", async ({ page, baseURL }) => {
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.resourceType() !== "document" || !request.url().startsWith(baseURL)) {
      return route.continue();
    }
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": csp } });
  });

  const violations = [];
  page.on("pageerror", (error) => violations.push(error.message));
  await page.exposeFunction("reportViolation", (text) => violations.push(text));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) =>
      window.reportViolation(`${event.violatedDirective} ${event.blockedURI} ${event.sample}`),
    );
  });

  await page.goto("/");
  await page.getByRole("button", { name: /^Play / }).click();
  await expect(page.locator('button[aria-label="Open command menu"]')).toBeAttached();
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/resume");
  await page.goto("/projects/tcg-inventory");
  await page.waitForLoadState("networkidle");

  expect(violations).toEqual([]);
});

test("speculation rules prefetch pages, prerender only case studies, and skip downloads and the API", () => {
  const rules = JSON.parse(fs.readFileSync("public/speculation-rules.json", "utf8"));
  const [prefetch] = rules.prefetch;
  expect(prefetch.eagerness).toBe("moderate");
  expect(JSON.stringify(prefetch.where)).toContain("/api/*");
  expect(JSON.stringify(prefetch.where)).toContain("[download]");
  const [prerender] = rules.prerender;
  expect(JSON.stringify(prerender.where)).toContain('"/projects/*"');
  expect(JSON.stringify(prerender.where)).toContain("[download]");
});
