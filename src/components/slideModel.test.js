import { describe, expect, it } from "vitest";
import {
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

  it("rejects storyboard payloads from a newer schema version", () => {
    expect(() =>
      parseImportedStoryboardPayload({
        schemaVersion: 999,
        slides: [createStoryboardSlide("content")],
      }),
    ).toThrow(/schema version/i);
  });
});
