import { expect, test } from "@playwright/test";
import fs from "node:fs";

test.describe("application submission exports", () => {
  test("resume renders and can be exported to PDF from the browser", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Browser PDF export is only supported in Chromium.",
    );

    await page.goto("/resume/");
    await expect(page.getByRole("button", { name: "Print resume" })).toBeVisible();
    await expect(page.locator("#resume-content")).toContainText("T. Dawson Woodrum");
    await expect(page.locator("#resume-content")).toContainText(/human evaluation/i);

    const pdfPath = testInfo.outputPath("T_Dawson_Woodrum_Resume_test-export.pdf");
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
    });

    expect(fs.statSync(pdfPath).size).toBeGreaterThan(10_000);
  });

  test("cv renders full browser-native content and can be exported to PDF", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Browser PDF export is only supported in Chromium.",
    );

    await page.goto("/cv/#cv");
    await expect(page.locator("#cv-content")).toContainText("T. Dawson Woodrum");
    await expect(page.locator("#cv-content")).not.toContainText("Do NOT run pandoc");
    await expect(page.locator("#publications")).toBeVisible();
    await expect(page.locator("#presentations")).toBeVisible();

    const pdfPath = testInfo.outputPath("T_Dawson_Woodrum_CV_test-export.pdf");
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
    });

    expect(fs.statSync(pdfPath).size).toBeGreaterThan(10_000);
  });
});


test("multiline citation emphasis renders without changing citation links", async ({ page }) => {
  await page.goto("/cv/");
  const project = page.locator("#cv-content li").filter({ hasText: "Agency-Space Theory —" });
  await expect(project.locator("em")).toContainText("A Mechanism-Level Theory of Conscious Agency Under Control");
  await expect(project).not.toContainText("*");
  await page.goto("/resume/");
  const ast = page.locator("#resume-content li").filter({ hasText: "Undue influence as dynamic constraint" });
  await expect(ast.locator("em")).toContainText("conscious agency under control");
  await expect(ast).not.toContainText("*");
  await expect(ast.getByRole("link")).toHaveAttribute("href", "https://doi.org/10.31234/osf.io/hjwp3_v1");
  const article = page.locator("#resume-content li").filter({ hasText: "Demoralization among TGD individuals" });
  await expect(article.locator("em")).toHaveText("Stigma and Health, 9");
  await expect(article).not.toContainText("*");
  await expect(article.getByRole("link")).toHaveAttribute("href", "https://doi.org/10.1037/sah0000311");
});
