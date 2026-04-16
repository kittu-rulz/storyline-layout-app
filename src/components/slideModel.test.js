import { describe, expect, it } from "vitest";
import {
  applyTemplatePreservingContent,
  changeScreenTypePreservingContent,
  createInitialFormState,
  createStoryboardSlide,
  parseImportedStoryboardPayload,
  sanitizeSavedSlide,
  validateSlideForExport,
} from "@/components/slideModel";

describe("slideModel", () => {
  it("preserves authored copy when switching screen type", () => {
    const initial = {
      ...createInitialFormState("content"),
      title: "Custom Title",
      body: "Custom body copy.",
      cta: "Keep Going",
      layout: "text-left-image-right",
    };

    const next = changeScreenTypePreservingContent(initial, "scenario");

    expect(next.screenType).toBe("scenario");
    expect(next.title).toBe("Custom Title");
    expect(next.body).toBe("Custom body copy.");
    expect(next.cta).toBe("Keep Going");
    expect(next.layout).toBe("scenario-branching");
  });

  it("falls back to defaults when switching with empty authored copy", () => {
    const initial = {
      ...createInitialFormState("content"),
      title: "   ",
      body: "",
      cta: "",
    };

    const next = changeScreenTypePreservingContent(initial, "quiz");

    expect(next.title).toBe("Which statement is correct?");
    expect(next.body).toBe("Choose the best answer based on what you just learned.");
    expect(next.cta).toBe("Submit");
  });

  it("sanitizes invalid saved slides to safe defaults", () => {
    const slide = sanitizeSavedSlide({
      id: "slide-1",
      screenType: "unknown-type",
      layout: "not-valid",
      theme: "missing-theme",
      title: "Saved Title",
    });

    expect(slide.screenType).toBe("content");
    expect(slide.layout).toBe("text-left-image-right");
    expect(slide.theme).toBe("corporate");
    expect(slide.templateId).toBe("content-image-01");
    expect(slide.title).toBe("Saved Title");
  });

  it("parses storyboard payloads and preserves the active slide id", () => {
    const first = createStoryboardSlide("title");
    const second = createStoryboardSlide("quiz");

    const parsed = parseImportedStoryboardPayload({
      slides: [first, second],
      activeSlideId: second.id,
    });

    expect(parsed.slides).toHaveLength(2);
    expect(parsed.activeSlideId).toBe(second.id);
  });

  it("assigns a sensible default template id for new slides", () => {
    expect(createStoryboardSlide("title").templateId).toBe("title-01");
    expect(createStoryboardSlide("objectives").templateId).toBe("objectives-01");
    expect(createStoryboardSlide("content").templateId).toBe("content-image-01");
    expect(createStoryboardSlide("comparison").templateId).toBe("comparison-01");
    expect(createStoryboardSlide("timeline").templateId).toBe("timeline-01");
    expect(createStoryboardSlide("tabs").templateId).toBe("tabs-01");
    expect(createStoryboardSlide("accordionInteraction").templateId).toBe("accordion-01");
    expect(createStoryboardSlide("interaction").templateId).toBe("click-reveal-01");
    expect(createStoryboardSlide("process").templateId).toBe("process-01");
    expect(createStoryboardSlide("scenario").templateId).toBe("scenario-decision-01");
    expect(createStoryboardSlide("quiz").templateId).toBe("quiz-mcq-01");
  });

  it("preserves backward compatibility for legacy slides without templateId", () => {
    const legacySlide = sanitizeSavedSlide({
      id: "legacy-slide",
      screenType: "tabs",
      layout: "tabs-top-content",
      title: "Legacy Tabs",
      body: "Old saved storyboard data should still load cleanly.",
      cta: "Continue",
    });

    expect(legacySlide.templateId).toBe("tabs-01");
    expect(legacySlide.screenType).toBe("tabs");
    expect(legacySlide.layout).toBe("tabs-top-content");
  });

  it("flags slides that are not ready for export", () => {
    const result = validateSlideForExport({
      ...createInitialFormState("content"),
      title: "   ",
      body: "",
      cta: "",
    });

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        "Title is required.",
        "Body copy is required.",
        "CTA label is required.",
      ]),
    );
  });

  it("accepts complete slides for export", () => {
    const result = validateSlideForExport(createInitialFormState("content"));

    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("applies a selected template while preserving authored copy", () => {
    const initial = {
      ...createInitialFormState("content"),
      title: "Preserved title",
      body: "This body should remain after template selection.",
      cta: "Keep going",
      contentBlocks: [
        {
          title: "Existing block",
          content: "This structured content should remain after switching templates.",
        },
      ],
    };

    const next = applyTemplatePreservingContent(initial, "cards-01");

    expect(next.templateId).toBe("cards-01");
    expect(next.screenType).toBe("content");
    expect(next.layout).toBe("two-column-text");
    expect(next.title).toBe("Preserved title");
    expect(next.body).toBe("This body should remain after template selection.");
    expect(next.cta).toBe("Keep going");
    expect(next.contentBlocks[0].title).toBe("Existing block");
    expect(next.contentBlocks[0].content).toBe(
      "This structured content should remain after switching templates.",
    );
  });

  it("rejects storyboard payloads from a newer schema version", () => {
    expect(() =>
      parseImportedStoryboardPayload({
        schemaVersion: 999,
        slides: [createStoryboardSlide("content")],
      }),
    ).toThrow(/schema version/i);
  });
});
