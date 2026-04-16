import { validateSlideForExport } from "@/components/slideModel";
import { CUSTOM_SLIDE_SIZE_PRESET } from "@/data/slideSizes";

function hasMeaningfulValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function getExportReadiness(form) {
  const validation = validateSlideForExport(form);
  const missingRequired = {
    title: !hasMeaningfulValue(form?.title),
    body: !hasMeaningfulValue(form?.body),
    cta: !hasMeaningfulValue(form?.cta),
    screenType: !hasMeaningfulValue(form?.screenType),
    layout: !hasMeaningfulValue(form?.layout),
    customWidth:
      form?.slideSizePreset === CUSTOM_SLIDE_SIZE_PRESET &&
      !(Number(form?.customSlideSize?.width) > 0),
    customHeight:
      form?.slideSizePreset === CUSTOM_SLIDE_SIZE_PRESET &&
      !(Number(form?.customSlideSize?.height) > 0),
  };

  const blockingFields = Object.entries(missingRequired)
    .filter(([, isMissing]) => isMissing)
    .map(([field]) => field);

  const sections = {
    structure: {
      complete: !missingRequired.screenType && !missingRequired.layout,
      missing: [missingRequired.screenType ? "screenType" : null, missingRequired.layout ? "layout" : null].filter(Boolean),
    },
    content: {
      complete: !missingRequired.title && !missingRequired.body && !missingRequired.cta,
      missing: [missingRequired.title ? "title" : null, missingRequired.body ? "body" : null, missingRequired.cta ? "cta" : null].filter(Boolean),
    },
    handoff: {
      complete: validation.valid,
      missing: validation.issues,
    },
  };

  return {
    valid: validation.valid,
    issues: validation.issues,
    blockingFields,
    missingRequired,
    sections,
    headline: validation.valid ? "Ready for handoff" : "Needs review",
    summary: validation.valid
      ? "The current slide has the core content needed for preview and export."
      : validation.issues.slice(0, 2).join(" "),
  };
}
