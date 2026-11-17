import { test, expect } from "@playwright/test";

test("home page renders without errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
      errors.push(message.text());
    }
  });
  // Analytics and Speed Insights only exist on Vercel.
  page.on("response", (res) => {
    if (res.status() >= 400 && !new URL(res.url()).pathname.startsWith("/_vercel/")) {
      errors.push(`${res.status()} ${res.url()}`);
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Joshua Leyva" })).toBeVisible();
  for (const id of ["work", "projects", "education", "skills", "aside", "contact"]) {
    await expect(page.locator(`section#${id}`)).toBeAttached();
  }
  expect(errors).toEqual([]);
});

test("the page never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
});

test("photos are served as responsive AVIF", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("picture source[type='image/avif'][srcset*='480w']").first()).toBeAttached();
});

test("the portrait is high priority and modern-format", async ({ page }) => {
  await page.goto("/");
  const portrait = page.getByRole("img", { name: "Joshua Leyva" });
  await expect(portrait).toHaveAttribute("fetchpriority", "high");
  await expect(portrait.locator("xpath=preceding-sibling::source[@type='image/avif']")).toHaveCount(1);
});

test("lightbox opens and closes", async ({ page }) => {
  await page.goto("/");
  await page.locator("#aside").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /open photo/i }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("dark visitors get the dark theme before the app loads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.route("**/assets/index-*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("meta[name='theme-color']")).toHaveAttribute("content", "#101412");
});

test("a saved light choice beats a dark system setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("darkMode", "false"));
  await page.route("**/assets/index-*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("carousel drifts on its own and can be dragged", async ({ page, isMobile }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: /photo carousel/i });
  await carousel.scrollIntoViewIfNeeded();
  const left = () => carousel.evaluate((node) => node.scrollLeft);

  const before = await left();
  await expect.poll(left, { timeout: 5000 }).toBeGreaterThan(before + 20);

  if (isMobile) return; // touch uses native scrolling, which Playwright can't drag
  const box = await carousel.boundingBox();
  const y = box.y + box.height / 2;
  const start = await left();
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 300, y, { steps: 8 });
  await page.mouse.up();
  expect(Math.abs((await left()) - start)).toBeGreaterThan(200);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("theme toggle switches to dark", async ({ page, isMobile }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: /menu/i }).click();
  await page.getByRole("button", { name: "Switch to dark mode" }).locator("visible=true").first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
