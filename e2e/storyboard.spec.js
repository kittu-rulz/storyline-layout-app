import { Buffer } from "node:buffer";
import { test, expect } from "@playwright/test";

const ONBOARDING_DISMISSED_KEY =
  "storyline-layout-app.storyboard.onboardingDismissed.v1";

function sectionByHeading(page, heading) {
  return page.locator("section").filter({
    has: page.getByRole("heading", { name: heading }),
  });
}

function contentFields(page) {
  return sectionByHeading(page, "Content").getByRole("textbox");
}

function handoffSection(page) {
  return sectionByHeading(page, "Handoff");
}

function storyboardSection(page) {
  return sectionByHeading(page, "Storyboard");
}

async function openFreshWorkspace(page, options = {}) {
  const { keepOnboarding = false } = options;

  await page.goto("/");
  await page.evaluate(({ keepOnboarding, key }) => {
    window.localStorage.clear();
    if (!keepOnboarding) {
      window.localStorage.setItem(key, "true");
    }
  }, { keepOnboarding, key: ONBOARDING_DISMISSED_KEY });
  await page.reload();

  await expect(page.getByText("Storyboard Workspace")).toBeVisible();
  await expect(page.getByText(/All changes saved locally/i).first()).toBeVisible();
}

async function fillCoreFields(page, { title, body, cta = "Continue" }) {
  const fields = contentFields(page);
  await fields.nth(0).fill(title);
  await fields.nth(1).fill(body);
  await fields.nth(2).fill(cta);
}

async function importStoryboardJson(page, file) {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await handoffSection(page).getByRole("button", { name: "Import Storyboard JSON" }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(file);
}

test("supports the core authoring flow across preview and production brief", async ({ page }) => {
  await openFreshWorkspace(page);

  await storyboardSection(page).getByRole("button", { name: "Add Slide" }).click();
  await expect(storyboardSection(page).getByText("2 slides in storyboard")).toBeVisible();

  await fillCoreFields(page, {
    title: "Core authoring workflow",
    body: "This copy should stay intact while the author explores different layouts.",
    cta: "Continue",
  });

  await sectionByHeading(page, "Screen Setup")
    .getByRole("button", { name: /Image Left \+ Text Right/i })
    .click();

  await expect(contentFields(page).nth(0)).toHaveValue("Core authoring workflow");
  await expect(contentFields(page).nth(1)).toHaveValue(
    "This copy should stay intact while the author explores different layouts.",
  );

  await page.getByRole("tab", { name: "Production Brief" }).click();
  await expect(page.getByText("Storyline Production Brief")).toBeVisible();
  await expect(page.getByText(/Title:\s*Core authoring workflow/i)).toBeVisible();

  await page.getByRole("tab", { name: "Preview" }).click();
  await expect(page.getByText(/Slide size:/i)).toBeVisible();
});

test("duplicates a slide and deletes it with the correct fallback selection", async ({ page }) => {
  await openFreshWorkspace(page);

  await fillCoreFields(page, {
    title: "Alpha slide",
    body: "Duplicate this slide and keep the copied content.",
    cta: "Next",
  });

  await page.getByRole("button", { name: "Duplicate Active" }).click();
  await expect(storyboardSection(page).getByText("2 slides in storyboard")).toBeVisible();
  await expect(contentFields(page).nth(0)).toHaveValue("Alpha slide");
  await expect(contentFields(page).nth(1)).toHaveValue("Duplicate this slide and keep the copied content.");

  await contentFields(page).nth(0).fill("Bravo slide");

  await storyboardSection(page).getByRole("button", { name: "Delete" }).first().click();
  await expect(page.getByRole("dialog", { name: /Delete slide/i })).toBeVisible();
  await page.getByRole("button", { name: /Delete slide/i }).click();

  await expect(storyboardSection(page).getByText("1 slide in storyboard")).toBeVisible();
  await expect(contentFields(page).nth(0)).toHaveValue("Alpha slide");
});

test("reorders slides and keeps the new order after reload", async ({ page }) => {
  await openFreshWorkspace(page);

  await fillCoreFields(page, {
    title: "First slide",
    body: "Original first position.",
    cta: "Next",
  });

  await storyboardSection(page).getByRole("button", { name: "Add Slide" }).click();
  await fillCoreFields(page, {
    title: "Second slide",
    body: "Original second position.",
    cta: "Next",
  });

  await storyboardSection(page).getByRole("button", { name: "Add Slide" }).click();
  await fillCoreFields(page, {
    title: "Third slide",
    body: "Original third position.",
    cta: "Next",
  });

  await page.getByRole("button", { name: /Move slide 1 down/i }).click();

  await expect.poll(async () => {
    const firstBox = await storyboardSection(page).getByText("First slide", { exact: true }).boundingBox();
    const secondBox = await storyboardSection(page).getByText("Second slide", { exact: true }).boundingBox();
    return Boolean(firstBox && secondBox && secondBox.y < firstBox.y);
  }).toBe(true);

  await page.reload();

  await expect.poll(async () => {
    const firstBox = await storyboardSection(page).getByText("First slide", { exact: true }).boundingBox();
    const secondBox = await storyboardSection(page).getByText("Second slide", { exact: true }).boundingBox();
    return Boolean(firstBox && secondBox && secondBox.y < firstBox.y);
  }).toBe(true);
});

test("imports a valid storyboard JSON file and loads the slides", async ({ page }) => {
  await openFreshWorkspace(page);

  await importStoryboardJson(page, {
    name: "storyboard.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        activeSlideId: "slide-2",
        slides: [
          {
            id: "slide-1",
            screenType: "content",
            layout: "text-left-image-right",
            title: "Imported intro",
            body: "Imported authoring context.",
            cta: "Continue",
            theme: "corporate",
          },
          {
            id: "slide-2",
            screenType: "quiz",
            layout: "mcq-standard",
            title: "Imported knowledge check",
            body: "Choose the best answer.",
            cta: "Submit",
            theme: "corporate",
          },
        ],
      }),
    ),
  });

  await expect(storyboardSection(page).getByText("2 slides in storyboard")).toBeVisible();
  await expect(storyboardSection(page).getByText("Imported intro", { exact: true })).toBeVisible();
  await expect(storyboardSection(page).getByText("Imported knowledge check", { exact: true })).toBeVisible();
  await expect(contentFields(page).nth(0)).toHaveValue("Imported knowledge check");
});

test("shows error feedback for invalid storyboard JSON and triggers spec export download when valid", async ({ page }) => {
  await openFreshWorkspace(page);

  await importStoryboardJson(page, {
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from("not valid json"),
  });

  await expect(page.getByRole("alert").last()).toContainText(/invalid json file/i);

  const downloadPromise = page.waitForEvent("download");
  await handoffSection(page).getByRole("button", { name: "Export Spec JSON" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.json$/i);
});

test("blocks export until required fields are restored and then re-enables it", async ({ page }) => {
  await openFreshWorkspace(page);

  await contentFields(page).nth(0).fill("");
  await contentFields(page).nth(1).fill("");
  await contentFields(page).nth(2).fill("");

  const specExportButton = handoffSection(page).getByRole("button", { name: "Export Spec JSON" });
  await expect(specExportButton).toBeDisabled();
  await expect(handoffSection(page).getByRole("status").last()).toContainText(/before export/i);

  await fillCoreFields(page, {
    title: "Restored title",
    body: "Restored body copy for export readiness.",
    cta: "Resume",
  });

  await expect(specExportButton).toBeEnabled();
  await expect(handoffSection(page).getByRole("status").last()).toContainText(/ready for export/i);
});

test("shows onboarding for a fresh state and keeps it dismissed after reload", async ({ page }) => {
  await openFreshWorkspace(page, { keepOnboarding: true });

  await expect(page.getByRole("heading", { name: "Getting started" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Start with blank slide/i })).toBeVisible();

  await page.getByRole("button", { name: /^Dismiss$/i }).click();
  await expect(page.getByRole("heading", { name: "Getting started" })).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Getting started" })).toHaveCount(0);
});
