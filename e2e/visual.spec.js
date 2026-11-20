import { test, expect } from "@playwright/test";

/*
 * Screenshot tests: the hero, the projects, and a case study, in light and
 * dark, on desktop and phone. Fonts render a little differently from one
 * machine to the next, so these only run inside the pinned Playwright
 * container, both in CI (the "visual" job) and locally:
 *
 *   npm run test:visual           compare against the baselines
 *   npm run test:visual:update    accept the current look as the new baseline
 *
 * Baselines live in e2e/__screenshots__. Review the diff before committing.
 */
test.skip(!process.env.VISUAL_TESTS, "screenshot tests run in the Playwright container: npm run test:visual");

test.use({ reducedMotion: "reduce" });

test.beforeEach(async ({ page }) => {
  // Same clock, no live data, no third-party images: only our pixels change.
  await page.clock.setFixedTime(new Date("2026-11-20T15:00:00Z"));
  await page.route("**/api/**", (route) => route.fulfill({ json: {} }));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
});

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  // The wallpaper loads once the page is idle; wait for it so it's in every shot.
  await page.locator(".wallpaper-img.is-shown").waitFor();
}

for (const scheme of ["light", "dark"]) {
  test(`home, ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await page.goto("/");
    await settle(page);
    await expect(page).toHaveScreenshot(`home-${scheme}.png`);
  });
}

test("projects", async ({ page }) => {
  await page.goto("/");
  await settle(page);
  const projects = page.locator("#projects");
  await projects.scrollIntoViewIfNeeded();
  await page.locator("#projects img").first().evaluate((img) => img.decode());
  await expect(projects).toHaveScreenshot("projects.png");
});

test("case study", async ({ page }) => {
  await page.goto("/projects/folio");
  await settle(page);
  await expect(page).toHaveScreenshot("case-study.png");
});
