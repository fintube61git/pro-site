import { expect, test } from "@playwright/test";

test("services redirect lands on contact services anchor target", async ({ page }) => {
  await page.goto("/services.html");
  await expect(page).toHaveURL(/practice\/services\.html$/);
  await expect(page.getByRole("heading", { level: 2, name: "Individual Therapy" })).toBeVisible();
});

test("privacy page renders expected heading", async ({ page }) => {
  await page.goto("/privacy.html");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacy");
});
