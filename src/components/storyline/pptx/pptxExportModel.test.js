import { describe, expect, it } from "vitest";
import {
  buildPptxExportModel,
  getPptxContentSection,
} from "@/components/storyline/pptx/pptxExportModel";

describe("getPptxContentSection", () => {
  it("formats content blocks into exportable text items", () => {
    const section = getPptxContentSection({
      screenType: "content",
      contentBlocks: [
        { title: "Core Insight", content: "The system now exports real copy." },
        { title: "Supporting Detail", content: "Secondary text is included too." },
      ],
    });

    expect(section.label).toBe("Content Blocks");
    expect(section.items).toEqual([
      "Core Insight: The system now exports real copy.",
      "Supporting Detail: Secondary text is included too.",
    ]);
  });

  it("uses interaction layout collections when building section items", () => {
    const section = getPptxContentSection({
      screenType: "interaction",
      layout: "tabs-interaction",
      tabsItems: [
        { title: "Overview", content: "Visible in the PPT export." },
        { title: "Details", content: "Also visible in the PPT export." },
      ],
    });

    expect(section.label).toBe("Tabs");
    expect(section.items).toEqual([
      "Overview: Visible in the PPT export.",
      "Details: Also visible in the PPT export.",
    ]);
  });
});

describe("buildPptxExportModel", () => {
  it("includes trimmed authored text and derived content items", () => {
    const model = buildPptxExportModel({
      screenType: "summary",
      layout: "takeaways-grid",
      title: "  Key Takeaways  ",
      body: "  Review the most important points.  ",
      cta: "  Next Module  ",
      notes: "Use these bullets in narration.",
      theme: "corporate",
      slideSizePreset: "storyline-16-9",
      customSlideSize: { width: 1280, height: 720 },
      safeMargins: { top: 96, right: 96, bottom: 96, left: 96 },
      summaryPoints: [
        { text: "First takeaway" },
        { text: "Second takeaway" },
      ],
      showSafeGrid: true,
    });

    expect(model.title).toBe("Key Takeaways");
    expect(model.body).toBe("Review the most important points.");
    expect(model.cta).toBe("Next Module");
    expect(model.contentLabel).toBe("Takeaways");
    expect(model.contentItems).toEqual(["First takeaway", "Second takeaway"]);
    expect(model.showSafeGrid).toBe(true);
  });
});
