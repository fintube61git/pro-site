import { expect, test } from "@playwright/test";

test("analytics remain blocked until consent and can be withdrawn", async ({ page, context }) => {
  let tagRequests = 0;
  await page.route("https://www.googletagmanager.com/**", async route => {
    tagRequests++;
    await route.fulfill({ contentType: "application/javascript", body: "/* Analytics tag intercepted for testing. */" });
  });
  await page.goto("/index.html");
  await expect(page.getByRole("region", { name: "Website analytics choices" })).toBeVisible();
  expect(tagRequests).toBe(0);
  expect((await context.cookies()).filter(cookie => cookie.name.startsWith("_ga"))).toEqual([]);
  await page.getByRole("button", { name: "Decline analytics", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("region", { name: "Website analytics choices" })).toBeHidden();
  expect(tagRequests).toBe(0);
  await page.getByRole("button", { name: "Analytics choices", exact: true }).click();
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  await expect.poll(() => tagRequests).toBe(1);
  expect(await page.evaluate(() => localStorage.getItem("site-analytics-consent"))).toBe("allowed");
  expect(await page.evaluate(() => (window as any)["ga-disable-G-1TZ12XRFQ9"])).toBe(false);
  await context.addCookies([{ name: "_ga", value: "test-only", url: page.url() }]);
  await page.getByRole("button", { name: "Analytics choices", exact: true }).click();
  await page.getByRole("button", { name: "Decline analytics", exact: true }).click();
  expect(await page.evaluate(() => (window as any)["ga-disable-G-1TZ12XRFQ9"])).toBe(true);
  expect((await context.cookies()).filter(cookie => cookie.name.startsWith("_ga"))).toEqual([]);
  await page.reload();
  await expect(page.getByRole("button", { name: "Analytics choices", exact: true })).toBeVisible();
  expect(tagRequests).toBe(1);
});

test("practice pages do not contact Google Analytics even after professional consent", async ({ page }) => {
  let analyticsRequests = 0;
  await page.route(/https:\/\/[^/]*(google-analytics\.com|googletagmanager\.com)\//, async route => {
    analyticsRequests++;
    await route.abort();
  });
  await page.addInitScript(() => localStorage.setItem("site-analytics-consent", "allowed"));
  for (const path of ["index", "approach", "services", "fees-policies", "faq", "contact", "privacy"]) {
    await page.goto(`/practice/${path}.html`);
    await expect(page.locator("main").getByRole("heading").first()).toBeVisible();
    expect(await page.locator('script[src*="analytics.js"], script[src*="googletagmanager.com"]').count()).toBe(0);
  }
  expect(analyticsRequests).toBe(0);
});

test("privacy choices work with keyboard navigation", async ({ page }) => {
  await page.goto("/privacy.html");
  const decline = page.getByRole("button", { name: "Decline analytics", exact: true });
  await decline.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Website analytics choices" })).toBeHidden();
  const settings = page.getByRole("button", { name: "Analytics choices", exact: true });
  await settings.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Allow analytics", exact: true })).toBeFocused();
});
