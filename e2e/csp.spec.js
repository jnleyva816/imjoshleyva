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
