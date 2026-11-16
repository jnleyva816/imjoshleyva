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

test("photos are served as responsive AVIF", async ({ page }) => {
  await page.goto("/");
  const avif = page.locator("picture source[type='image/avif']").first();
  await expect(avif).toHaveAttribute("srcset", /480w/);
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

test("theme toggle switches to dark", async ({ page, isMobile }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: /menu/i }).click();
  await page.getByRole("button", { name: "Switch to dark mode" }).locator("visible=true").first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
