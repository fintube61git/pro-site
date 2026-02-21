import { expect, test } from "@playwright/test";

test("top navigation routes to primary pages", async ({ page }) => {
  test.skip(
    test.info().project.name.includes("mobile"),
    "Desktop flow; mobile navigation behavior is covered by mobile-nav.spec.ts",
  );

  async function openNavIfCollapsed() {
    const menuToggle = page.getByRole("button", { name: "Menu" });
    if (await menuToggle.isVisible()) {
      const isCollapsed = (await menuToggle.getAttribute("aria-expanded")) !== "true";
      if (isCollapsed) {
        await menuToggle.click();
      }
    }
  }

  await page.goto("/index.html");
  await openNavIfCollapsed();
  const primaryNav = page.getByLabel("Primary");

  await primaryNav.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/about\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("My approach to care");

  await openNavIfCollapsed();
  await primaryNav.getByRole("link", { name: "Apps" }).click();
  await expect(page).toHaveURL(/apps\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("External tools for understanding internal systems");

  await openNavIfCollapsed();
  await primaryNav.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/contact\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Contact");
});

test("home links to cv sections", async ({ page }) => {
  await page.goto("/index.html");

  const cvLink = page.getByRole("link", { name: "Full CV" });
  await expect(cvLink).toHaveAttribute("href", "cv/#cv");
  await expect(cvLink).toHaveAttribute("target", "_blank");
});
