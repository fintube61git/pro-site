import { expect, test } from "@playwright/test";

test("payments-insurance redirect lands on contact scheduling", async ({ page }) => {
  await page.goto("/payments-insurance.html");
  await expect(page).toHaveURL(/contact\.html#scheduling$/);
});

test("services redirect lands on contact services anchor target", async ({ page }) => {
  await page.goto("/services.html");
  await expect(page).toHaveURL(/contact\.html#services$/);
});

test("privacy page renders expected heading", async ({ page }) => {
  await page.goto("/privacy.html");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy");
});
