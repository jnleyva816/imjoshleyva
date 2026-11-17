import { test, expect } from "@playwright/test";
import fs from "node:fs";

// `vite preview` doesn't send vercel.json headers, so apply the CSP to our own documents here.
const { headers } = JSON.parse(fs.readFileSync("vercel.json", "utf8")).headers[0];
const csp = headers.find((header) => header.key === "Content-Security-Policy").value;

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

  await page.goto("/#studio");
  await page.waitForLoadState("networkidle");

  expect(violations).toEqual([]);
});

// Production only reports Trusted Types violations for now; the site itself
// should already pass with them enforced.
test("our pages work with Trusted Types enforced", async ({ page, baseURL }) => {
  const reportOnly = headers.find((header) => header.key === "Content-Security-Policy-Report-Only").value;
  const enforced = `${csp}; ${reportOnly.split(";").filter((part) => !/report-(uri|to)/.test(part)).join(";")}`;
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (request.resourceType() !== "document" || !request.url().startsWith(baseURL)) {
      return route.continue();
    }
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), "content-security-policy": enforced } });
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
  await page.goto("/#studio");
  await page.waitForLoadState("networkidle");

  expect(violations).toEqual([]);
});

test("speculation rules are valid and skip downloads and the API", () => {
  const rules = JSON.parse(fs.readFileSync("public/speculation-rules.json", "utf8"));
  const [rule] = rules.prerender;
  expect(rule.eagerness).toBe("moderate");
  expect(JSON.stringify(rule.where)).toContain("/api/*");
  expect(JSON.stringify(rule.where)).toContain("[download]");
});
