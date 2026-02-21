import { expect, test } from "@playwright/test";

test("mobile nav toggle opens and closes the menu", async ({ page }) => {
  test.skip(
    !test.info().project.name.includes("mobile"),
    "This smoke test is only applicable to mobile projects.",
  );

  await page.goto("/index.html");

  const toggle = page.getByRole("button", { name: "Menu" });
  const menu = page.locator("#nav-menu");

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toHaveAttribute("hidden", "");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu).not.toHaveAttribute("hidden", "");
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toHaveAttribute("hidden", "");
});
