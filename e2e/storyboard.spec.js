import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("author can create slides and open the production brief", async ({ page }) => {
  await expect(page.getByText("Storyboard Workspace")).toBeVisible();
  await expect(page.getByText(/All changes saved locally/i).first()).toBeVisible();
  await expect(page.getByText("1 slide in storyboard")).toBeVisible();

  await page.getByRole("button", { name: "Add Slide" }).first().click();

  await expect(page.getByText("2 slides in storyboard")).toBeVisible();

  await page.getByRole("button", { name: "Open Production Brief" }).click();
  await expect(page.getByText("Storyline Production Brief")).toBeVisible();

  await page.getByRole("tab", { name: "Preview" }).click();
  await expect(page.getByText(/Slide size:/i)).toBeVisible();
});

test("author can export a spec JSON file", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Export Spec JSON" }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/i);
});
