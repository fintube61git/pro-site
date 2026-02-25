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
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Professional Background");

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

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Psychology, technology, and practical implementation",
  );
  await expect(page.getByRole("heading", { level: 2, name: "What I Work On" })).toBeVisible();
  await expect(page.getByText("Responsible AI in Clinical Contexts")).toBeVisible();
  await expect(page.getByText("Privacy-Conscious Practice Tools")).toBeVisible();
  await expect(page.getByText("Speaking and Team Training")).toBeVisible();
  await expect(page.getByText("IFS-informed psychotherapy for complex trauma")).toHaveCount(0);

  const cvLink = page.getByRole("link", { name: "Full CV" });
  await expect(cvLink).toHaveAttribute("href", "cv/#cv");
  await expect(cvLink).toHaveAttribute("target", "_blank");

  const publicationsLink = page.getByRole("link", { name: "Publications" });
  await expect(publicationsLink).toHaveAttribute("href", "cv/#publications");
  await expect(publicationsLink).toHaveAttribute("target", "_blank");

  const presentationsLink = page.getByRole("link", { name: "Presentations" });
  await expect(presentationsLink).toHaveAttribute("href", "cv/#presentations");
  await expect(presentationsLink).toHaveAttribute("target", "_blank");
});

test("home document links open cv route targets", async ({ page, context }) => {
  await page.goto("/index.html");

  const popupFor = async (linkName: "Full CV" | "Publications" | "Presentations") => {
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("link", { name: linkName }).click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    return popup;
  };

  const cvPopup = await popupFor("Full CV");
  await expect(cvPopup).toHaveURL(/\/cv\/#cv$/);
  await cvPopup.close();

  const pubsPopup = await popupFor("Publications");
  await expect(pubsPopup).toHaveURL(/\/cv\/#publications$/);
  await pubsPopup.close();

  const presPopup = await popupFor("Presentations");
  await expect(presPopup).toHaveURL(/\/cv\/#presentations$/);
  await presPopup.close();
});
