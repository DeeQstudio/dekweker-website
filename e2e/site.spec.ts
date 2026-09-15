import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("kwkr-intro-v1", "1"));
  page.on("pageerror", (error) => { throw error; });
});

const routes = ["/", "/muziek", "/muziek/geen-slim-shady", "/live", "/live/dominus-mma-iv-2025", "/media", "/de-kweker", "/booking", "/privacy", "/voorwaarden"];

for (const width of [320, 390, 760, 834, 1100, 1440, 1920, 2557]) {
  test(`readable routes and intact artist name at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      // Finish automatic route prefetches before the next full-page navigation.
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const title = page.locator("main h1");
      await expect(title, route).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, route).toBeLessThanOrEqual(1);
      const text = await title.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return [...range.getClientRects()].filter((rect) => rect.width > 0).map((rect) => ({ left: rect.left, right: rect.right }));
      });
      for (const rect of text) {
        expect(rect.left, route).toBeGreaterThanOrEqual(-1);
        expect(rect.right, route).toBeLessThanOrEqual(width + 1);
      }
      if (route === "/de-kweker") {
        const word = await title.evaluate((element) => {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const start = node.textContent?.indexOf("KWEKER.") ?? -1;
            if (start < 0) continue;
            const range = document.createRange();
            range.setStart(node, start);
            range.setEnd(node, start + "KWEKER.".length);
            return [...range.getClientRects()].map((rect) => ({ top: rect.top, left: rect.left, right: rect.right }));
          }
          return [];
        });
        expect(word).toHaveLength(1);
        expect(word[0]!.left).toBeGreaterThanOrEqual(0);
        expect(word[0]!.right).toBeLessThanOrEqual(width);
      }
    }
  });
}

test("mobile menu restores focus and client navigation keeps profile typography stable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/de-kweker");
  await page.evaluate(() => document.fonts.ready);
  const title = page.locator(".profile-hero-copy h1");
  const before = await title.boundingBox();
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "Verken De Kweker" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await dialog.getByRole("link", { name: "Muziek", exact: true }).click();
  await expect(page).toHaveURL(/\/muziek$/);
  await expect(dialog).not.toBeVisible();
  await menu.click();
  await dialog.getByRole("link", { name: "De Kweker", exact: true }).click();
  await expect(page).toHaveURL(/\/de-kweker$/);
  await expect(title).toBeVisible();
  expect(await title.boundingBox()).toEqual(before);
});

test("records select, flip, navigate by keyboard and load sharp artwork", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/muziek");
  const selectors = page.locator(".record-selector button");
  for (let index = 0; index < await selectors.count(); index++) {
    await selectors.nth(index).click();
    await expect(selectors.nth(index)).toHaveAttribute("aria-pressed", "true");
    const selected = page.locator(".record-object.is-selected");
    const image = selected.locator("img");
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThanOrEqual(380);
    await page.getByRole("button", { name: "Hoes omdraaien", exact: true }).click();
    await expect(selected).toHaveClass(/is-flipped/);
    await expect(selected.locator(".record-back")).toHaveAttribute("aria-hidden", "false");
    await page.getByRole("button", { name: "Cover bekijken", exact: true }).click();
    await expect(selected).not.toHaveClass(/is-flipped/);
  }
  await selectors.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(selectors.nth(1)).toBeFocused();
  await expect(selectors.nth(1)).toHaveAttribute("aria-pressed", "true");
});

test("gallery and video close cleanly and restore the trigger", async ({ page }) => {
  await page.goto("/media");
  const trigger = page.locator(".photo-print").first();
  await trigger.click();
  const gallery = page.getByRole("dialog", { name: "Fotogalerij" });
  await expect(gallery).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(gallery.locator(".photo-dialog-toolbar")).toContainText("2 van");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  // Verify the embed lifecycle without loading or playing a third-party video.
  await page.route("https://www.youtube-nocookie.com/**", (route) => route.fulfill({ contentType: "text/html", body: "<html><title>Video fixture</title></html>" }));
  await page.goto("/muziek");
  const video = page.locator(".video-dialog-trigger").first();
  await video.click();
  await expect(page.locator(".video-dialog iframe")).toHaveCount(1);
  await page.locator(".video-dialog").getByRole("button", { name: "Sluiten" }).click();
  await expect(page.locator(".video-dialog iframe")).toHaveCount(0);
  await expect(video).toBeFocused();
});

test("booking intent and archive filters update their actual content", async ({ page }) => {
  await page.goto("/booking");
  await expect(page.getByLabel("Naam of organisatie")).toHaveAttribute("required", "");
  await page.getByLabel("Pers", { exact: true }).check();
  await expect(page.getByLabel("Onderwerp en deadline")).toBeVisible();
  await expect(page.locator('input[name="date"]')).toHaveCount(0);
  await page.getByLabel("Optreden", { exact: true }).check();
  await expect(page.locator('input[name="date"]')).toBeVisible();
  await page.goto("/live");
  await page.getByRole("button", { name: "2025", exact: true }).click();
  const dates = await page.locator(".archive-rows time").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("datetime")));
  expect(dates.length).toBeGreaterThan(0);
  expect(dates.every((date) => date?.startsWith("2025"))).toBe(true);
});

test("navigation recovers if reduced motion interrupts an animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator(".header-booking").click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page).toHaveURL(/\/booking$/);
  await expect(page.locator(".route-transition")).toHaveAttribute("data-phase", "idle");
  await expect.poll(() => page.locator("[data-depth]").first().evaluate((element: HTMLElement) => element.style.getPropertyValue("--depth-y"))).toBe("");
  await page.getByRole("link", { name: "De Kweker home", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("core content remains readable with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3137/de-kweker");
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator(".site-intro")).not.toBeVisible();
  await expect(page.locator(".header-booking")).toHaveAttribute("href", "/booking");
  await context.close();
});
