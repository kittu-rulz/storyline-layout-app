import { describe, expect, it } from "vitest";
import { createStoryboardSlide } from "@/components/slideModel";
import { getWorkflowSteps } from "@/features/storyboard/utils/getWorkflowSteps";
import { getExportReadiness } from "@/features/storyboard/utils/getExportReadiness";
import { getFieldValidationMap } from "@/features/storyboard/utils/getFieldValidationMap";

describe("storyboard sidebar validation utilities", () => {
  it("builds the same workflow progress for a handoff-ready slide", () => {
    const form = createStoryboardSlide("content");
    const exportReadiness = getExportReadiness(form);

    const result = getWorkflowSteps({
      form,
      workspaceTab: "preview",
      exportReadiness,
    });

    expect(result.steps).toHaveLength(3);
    expect(result.completedCount).toBe(3);
    expect(result.steps.every((step) => step.done)).toBe(true);
  });

  it("derives blocking fields from the existing export validation rules", () => {
    const form = createStoryboardSlide("content");
    form.title = "";
    form.body = "";
    form.cta = "";

    const result = getExportReadiness(form);

    expect(result.valid).toBe(false);
    expect(result.blockingFields).toEqual(expect.arrayContaining(["title", "body", "cta"]));
    expect(result.sections.content.complete).toBe(false);
  });

  it("keeps inline guidance quiet until the user interacts or attempts export", () => {
    const form = {
      screenType: "content",
      title: "",
      body: "",
      cta: "",
      notes: "",
    };

    const untouched = getFieldValidationMap(form);
    const attempted = getFieldValidationMap(form, { hasAttemptedExport: true });

    expect(untouched.title.shouldShow).toBe(false);
    expect(untouched.body.shouldShow).toBe(false);
    expect(attempted.title.shouldShow).toBe(true);
    expect(attempted.body.shouldShow).toBe(true);
  });

  it("shows focused hints once the author has started drafting", () => {
    const form = createStoryboardSlide("content");
    form.title = "Working title";
    form.body = "";

    const result = getFieldValidationMap(form);

    expect(result.body.shouldShow).toBe(true);
    expect(result.body.message).toMatch(/body copy/i);
    expect(result.title.shouldShow).toBe(false);
  });
});
