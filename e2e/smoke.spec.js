import { test, expect } from "@playwright/test";

test("home page renders without errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) {
      errors.push(message.text());
    }
  });
  // Analytics, Speed Insights, and the api/ functions only exist on Vercel.
  page.on("response", (res) => {
    const { pathname } = new URL(res.url());
    if (res.status() >= 400 && !pathname.startsWith("/_vercel/") && !pathname.startsWith("/api/")) {
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

test("every photo has a description for screen readers", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const missing = await page.evaluate(() =>
    // Decorative images (like the video cover) may keep alt="" because their
    // button is labelled; everything else needs real text.
    [...document.querySelectorAll("main img")]
      .filter((img) => !img.src.includes("ytimg.com"))
      .filter((img) => !img.hasAttribute("alt") || img.alt.trim() === "")
      .map((img) => img.currentSrc || img.src),
  );
  expect(missing).toEqual([]);
});

test("no element carries an aria-label it cannot support", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const bad = await page.evaluate(() =>
    [...document.querySelectorAll("p[aria-label], span[aria-label]:not([role])")].map((el) => el.outerHTML.slice(0, 80)),
  );
  expect(bad).toEqual([]);
});

test("the nav marks the section you are reading", async ({ page, isMobile }) => {
  test.skip(isMobile, "the desktop nav is hidden on phones");
  await page.goto("/");
  await expect(page.locator('nav[aria-label="Primary"] [aria-current]')).toHaveCount(0);
  await page.locator("#education").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("education").scrollIntoView({ behavior: "instant" }));
  await expect(page.locator('nav[aria-label="Primary"] a[aria-current="location"]')).toHaveText("Education");
});

test("the contact form explains what is wrong next to the field", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  let sent = false;
  await page.route("**/api/contact", (route) => {
    sent = true;
    return route.fulfill({ status: 200, json: { success: true } });
  });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#contact-name-error")).toBeVisible();
  await expect(page.locator("#contact-email-error")).toBeVisible();
  await expect(page.locator("#contact-message-error")).toBeVisible();
  await expect(page.locator("#contact-name")).toBeFocused();
  await expect(page.locator("#contact-name")).toHaveAttribute("aria-invalid", "true");

  await page.locator("#contact-name").fill("Ada");
  await expect(page.locator("#contact-name-error")).toHaveCount(0);

  await page.locator("#contact-email").fill("not-an-email");
  await page.locator("#contact-message").fill("Hello there, nice site.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#contact-email-error")).toHaveText(/doesn't look right/);
  expect(sent).toBe(false);

  await page.locator("#contact-email").fill("ada@example.com");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Thanks, it's on its way.")).toBeVisible();
});

test("icons and manifest are served and linked", async ({ request, page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
  for (const path of ["/favicon.svg", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png"]) {
    const res = await request.get(path);
    expect(res.ok(), path).toBe(true);
  }
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.name).toBe("Joshua Leyva");
  expect(manifest.icons.length).toBeGreaterThan(1);
});

test("print view drops controls and photos", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("header")).toBeHidden();
  await expect(page.locator("form")).toBeHidden();
  await expect(page.locator("figure").first()).toBeHidden();
  await expect(page.getByRole("heading", { level: 1, name: "Joshua Leyva" })).toBeVisible();
});

test("the plant wallpaper sits behind a translucent page", async ({ page }) => {
  await page.goto("/");
  const wallpaper = page.locator(".wallpaper");
  await expect(wallpaper).toHaveAttribute("aria-hidden", "true");
  await expect(wallpaper.locator("img")).toHaveAttribute("alt", "");
  const { position, veil } = await page.evaluate(() => ({
    position: getComputedStyle(document.querySelector(".wallpaper")).position,
    veil: getComputedStyle(document.getElementById("top")).backgroundColor,
  }));
  expect(position).toBe("fixed");
  expect(veil).not.toMatch(/^rgb\(/);
});

test("the nav underline follows the section you are reading", async ({ page, isMobile }) => {
  test.skip(isMobile, "the desktop nav is hidden on phones");
  await page.goto("/");
  const bar = page.locator(".nav-bar");
  await page.evaluate(() => document.getElementById("projects").scrollIntoView({ behavior: "instant" }));
  await expect(bar).toHaveCSS("opacity", "1");
  const link = page.locator('nav[aria-label="Primary"] a', { hasText: "Projects" });
  await expect
    .poll(async () => {
      const [b, l] = await Promise.all([bar.boundingBox(), link.boundingBox()]);
      return Math.abs(b.x - l.x) < 2 && Math.abs(b.width - l.width) < 2;
    })
    .toBe(true);
});

test("work rows glow where the cursor is", async ({ page, isMobile }) => {
  test.skip(isMobile, "no hover on touch screens");
  await page.goto("/");
  const row = page.locator("#work article.spotlight").first();
  await row.scrollIntoViewIfNeeded();
  const box = await row.boundingBox();
  await page.mouse.move(box.x + 100, box.y + 30);
  await page.mouse.move(box.x + 120, box.y + 40);
  await expect.poll(() => row.evaluate((el) => el.style.getPropertyValue("--mx"))).not.toBe("");
});

test("the résumé has its own page with the PDF one click away", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/resume");
  await expect(page).toHaveTitle(/Résumé/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Joshua N. Leyva");
  await expect(page.getByRole("heading", { name: "Cryptio" })).toBeVisible();
  const pdf = page.getByRole("link", { name: "Download PDF" });
  await expect(pdf).toHaveAttribute("download", "JoshuaLeyvaResume.pdf");
  const res = await page.request.get(await pdf.getAttribute("href"));
  expect(res.headers()["content-type"]).toContain("pdf");
  expect(errors).toEqual([]);
});

test("each project with a case study gets a page", async ({ page }) => {
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.getByRole("link", { name: "Case study" }).first().click();
  await expect(page).toHaveURL(/\/projects\/tcg-inventory$/);
  await expect(page).toHaveTitle("TCG inventory · Joshua Leyva");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TCG inventory");
  await expect(page.getByRole("heading", { name: "How it works" })).toBeVisible();
  await page.getByRole("link", { name: /Personal site →/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Personal site");
});

test("an unknown project says so", async ({ page }) => {
  await page.goto("/projects/nope");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("No such project");
});

test("nav links from a subpage go back to the home sections", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav");
  await page.goto("/resume");
  await page.locator('nav[aria-label="Primary"]').getByRole("link", { name: "Skills" }).click();
  await expect(page).toHaveURL(/\/#skills$/);
  await expect(page.locator("#skills")).toBeInViewport();
});

test("the command menu opens with the keyboard and runs commands", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut");
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Open command menu" })).toBeVisible();
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Command menu" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("combobox")).toBeFocused();

  await page.keyboard.type("dark");
  await expect(page.getByRole("option")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.keyboard.press("Control+k");
  await page.keyboard.type("educ");
  await page.keyboard.press("Enter");
  await expect(page.locator("#education")).toBeInViewport();

  await page.keyboard.press("Control+k");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("the command menu can be opened from the mobile menu", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile menu");
  await page.goto("/");
  await page.getByRole("button", { name: /menu/i }).click();
  await page.getByRole("button", { name: "Quick menu" }).click();
  await expect(page.getByRole("dialog", { name: "Command menu" })).toBeVisible();
  await page.getByRole("option", { name: /Résumé/ }).click();
  await expect(page).toHaveURL(/\/resume$/);
});

test("the hero shows local time and a now note", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header + main time, main time").first()).toHaveText(/\d{1,2}:\d{2}\s?[AP]M in Florida/);
  await expect(page.getByText("Now", { exact: true })).toBeVisible();
});

test("the lately block stays hidden when there is nothing to show", async ({ page }) => {
  await page.route("**/api/writing", (route) => route.fulfill({ json: { posts: [] } }));
  await page.route("**/api/running", (route) => route.fulfill({ json: { configured: false } }));
  await page.goto("/");
  await page.locator("#aside").scrollIntoViewIfNeeded();
  await expect(page.getByText("Latest writing")).toHaveCount(0);
});

test("the lately block shows posts and running when they exist", async ({ page }) => {
  await page.route("**/api/writing", (route) =>
    route.fulfill({ json: { posts: [{ title: "First post", url: "https://joshualeyva.substack.com/p/one", date: "2026-11-16T00:00:00.000Z" }] } }),
  );
  await page.route("**/api/running", (route) =>
    route.fulfill({ json: { configured: true, recent: { runs: 18, miles: 142, hours: 21 }, year: { runs: 160, miles: 1200, hours: 170 } } }),
  );
  await page.goto("/");
  await page.locator("#aside").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: "First post" })).toBeVisible();
  await expect(page.getByText("142")).toBeVisible();
});
