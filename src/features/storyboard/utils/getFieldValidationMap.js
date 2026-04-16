import { getScreenDefaults } from "@/components/slideModel";
import { getExportReadiness } from "@/features/storyboard/utils/getExportReadiness";

function hasMeaningfulValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasStartedDrafting(form) {
  const defaults = getScreenDefaults(form?.screenType);

  return (
    (hasMeaningfulValue(form?.title) && (form?.title ?? "") !== (defaults?.title ?? "")) ||
    (hasMeaningfulValue(form?.body) && (form?.body ?? "") !== (defaults?.body ?? "")) ||
    (hasMeaningfulValue(form?.cta) && (form?.cta ?? "") !== (defaults?.cta ?? "")) ||
    hasMeaningfulValue(form?.notes)
  );
}

export function getFieldValidationMap(form, options = {}) {
  const { hasAttemptedExport = false } = options;
  const exportReadiness = getExportReadiness(form);
  const showGuidance = hasAttemptedExport || hasStartedDrafting(form);

  return {
    showGuidance,
    title: {
      isMissing: exportReadiness.missingRequired.title,
      shouldShow: showGuidance && exportReadiness.missingRequired.title,
      message: "Add a short working title before export.",
    },
    body: {
      isMissing: exportReadiness.missingRequired.body,
      shouldShow: showGuidance && exportReadiness.missingRequired.body,
      message: "Add the main learner-facing body copy.",
    },
    cta: {
      isMissing: exportReadiness.missingRequired.cta,
      shouldShow: showGuidance && exportReadiness.missingRequired.cta,
      message: "Add the button or next-step label used on the slide.",
    },
    screenType: {
      isMissing: exportReadiness.missingRequired.screenType,
      shouldShow: showGuidance && exportReadiness.missingRequired.screenType,
      message: "Choose a screen type to continue.",
    },
    layout: {
      isMissing: exportReadiness.missingRequired.layout,
      shouldShow: showGuidance && exportReadiness.missingRequired.layout,
      message: "Choose a layout style before export.",
    },
    sections: exportReadiness.sections,
  };
}
