import { describe, expect, it } from "vitest";
import {
  STORYBOARD_TEMPLATES,
  getDefaultTemplateId,
  getTemplateById,
  getTemplatesByCategory,
  getTemplatesByScreenType,
  resolveTemplateForSlide,
} from "@/features/storyboard/templates";

describe("storyboard template registry", () => {
  it("exports the registered Storyline-style templates without duplicate ids", () => {
    const templateIds = STORYBOARD_TEMPLATES.map((template) => template.id);

    expect(templateIds).toEqual(
      expect.arrayContaining([
        "title-01",
        "objectives-01",
        "agenda-01",
        "content-image-01",
        "comparison-01",
        "cards-01",
        "tabs-01",
        "accordion-01",
        "timeline-01",
        "click-reveal-01",
        "scenario-decision-01",
        "quiz-mcq-01",
        "process-01",
      ]),
    );
    expect(new Set(templateIds).size).toBe(templateIds.length);

    STORYBOARD_TEMPLATES.forEach((template) => {
      expect(typeof template.id).toBe("string");
      expect(typeof template.name).toBe("string");
      expect(typeof template.category).toBe("string");
      expect(typeof template.screenType).toBe("string");
      expect(typeof template.description).toBe("string");
      expect(typeof template.intent).toBe("string");
      expect(template.defaultContent).toBeTruthy();
      expect(template.placeholderSchema).toBeTruthy();
      expect(typeof template.thumbnail).toBe("function");
      expect(template.preview?.componentKey).toBeTruthy();
      expect(template.handoff?.buildNotes?.length).toBeGreaterThan(0);
    });
  });

  it("supports lookup by template id and filtering", () => {
    const template = getTemplateById("comparison-01");
    const dynamicTemplate = getTemplateById("content-image-01");

    expect(template?.name).toBe("Compare Options");
    expect(template?.editableFieldSchema.length).toBeGreaterThan(0);
    expect(template?.handoff.buildNotes.length).toBeGreaterThan(0);
    expect(typeof template?.intent).toBe("string");
    expect(typeof template?.usageHint).toBe("string");
    expect(template?.usageHint.length).toBeGreaterThan(0);
    expect(template?.placeholderSchema).toBeTruthy();
    expect(dynamicTemplate?.formSchema?.sections?.length).toBeGreaterThan(0);

    expect(getTemplatesByScreenType("objectives").map((item) => item.id)).toEqual(
      expect.arrayContaining(["objectives-01", "agenda-01"]),
    );
    expect(getTemplatesByScreenType("interaction").map((item) => item.id)).toContain(
      "click-reveal-01",
    );
    expect(getTemplatesByCategory("process").map((item) => item.id)).toContain("process-01");
    expect(getTemplatesByCategory("scenario").map((item) => item.id)).toContain(
      "scenario-decision-01",
    );
  });

  it("provides best-fit default template assignment for expanded screen coverage", () => {
    expect(getDefaultTemplateId({ screenType: "objectives", layout: "objectives-list" })).toBe(
      "objectives-01",
    );
    expect(getDefaultTemplateId({ screenType: "comparison", layout: "comparison-side-by-side" })).toBe(
      "comparison-01",
    );
    expect(getDefaultTemplateId({ screenType: "timeline", layout: "timeline-horizontal" })).toBe(
      "timeline-01",
    );
    expect(getDefaultTemplateId({ screenType: "quiz", layout: "mcq-standard" })).toBe(
      "quiz-mcq-01",
    );

    const resolved = resolveTemplateForSlide({
      screenType: "quiz",
      layout: "mcq-standard",
    });

    expect(resolved?.id).toBe("quiz-mcq-01");
  });
});
