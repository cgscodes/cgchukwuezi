import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const origin = process.env.PORTFOLIO_ORIGIN || "http://127.0.0.1:8000";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const results = [];
try {
  for (const scheme of ["dark", "light"])
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({
        colorScheme: scheme,
        viewport: { width, height: 1000 },
      });
      const page = await context.newPage();
      for (const path of ["/", "/work/"]) {
        await page.goto(origin + path, { waitUntil: "networkidle" });
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          scheme,
        );
        if (width < 768)
          await page.getByRole("button", { name: "Menu", exact: true }).click();
        const other = scheme === "dark" ? "light" : "dark";
        const button = page.getByRole("button", {
          name: `Switch to ${other} mode`,
          exact: true,
        });
        assert(await button.isVisible());
        await button.focus();
        await page.keyboard.press("Enter");
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          other,
        );
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          other,
        );
        assert(
          !(await page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth,
          )),
        );
        if (width < 768)
          await page.getByRole("button", { name: "Menu", exact: true }).click();
        await page
          .getByRole("button", {
            name: `Switch to ${scheme} mode`,
            exact: true,
          })
          .click();
        if (width < 768) await page.keyboard.press("Escape");
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        results.push({
          scheme,
          width,
          path,
          violations: axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              message: n.failureSummary,
            })),
          })),
        });
      }
      if (scheme === "dark" && width === 1440) {
        await page.goto(origin + "/");
        await page.screenshot({ path: "artifacts/theme-dark-desktop.png" });
      }
      await context.close();
    }
  await writeFile(
    "artifacts/theme-results.json",
    JSON.stringify(results, null, 2),
  );
  assert.equal(
    results.flatMap((r) => r.violations).length,
    0,
    JSON.stringify(results.filter((r) => r.violations.length)),
  );
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto(origin + "/");
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "light",
  );
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await context.close();
  const blocked = await browser.newContext({ colorScheme: "dark" });
  await blocked.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    }),
  );
  const fallback = await blocked.newPage();
  await fallback.goto(origin + "/");
  await fallback
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  assert.equal(
    await fallback.locator("html").getAttribute("data-theme"),
    "light",
  );
  await blocked.close();
  console.log(
    "Theme checks passed: system defaults, keyboard toggle, saved choice, live OS preference, blocked storage, overflow and zero axe violations.",
  );
} finally {
  await browser.close();
}
