import { DYNAMIC_COLLECTION_FIELDS } from "@/components/slideModel";
import { createInitialFormState } from "@/components/storylineFormState";

export const FIRST_RUN_GUIDANCE_DISMISSED_KEY =
  "storyline-layout-app.storyboard.onboardingDismissed.v1";

const COMPARABLE_FIELDS = [
  "screenType",
  "title",
  "body",
  "cta",
  "layout",
  "theme",
  "slideSizePreset",
  "customSlideSize",
  "showSafeGrid",
  "showGridLabels",
  "showRulers",
  "showPixelGrid",
  "notes",
  "safeAreaPreset",
  "safeMargins",
  ...DYNAMIC_COLLECTION_FIELDS,
];

function serialize(value) {
  return JSON.stringify(value ?? null);
}

export function isUntouchedDefaultSlide(slide) {
  if (!slide?.screenType) {
    return false;
  }

  const defaults = createInitialFormState(slide.screenType);

  return COMPARABLE_FIELDS.every((field) => serialize(slide[field]) === serialize(defaults[field]));
}

export function getFirstRunGuidanceState({ slides, dismissed }) {
  const hasSingleSlide = Array.isArray(slides) && slides.length === 1;
  const activeSlide = hasSingleSlide ? slides[0] : null;
  const isNewStoryboard = Boolean(activeSlide) && isUntouchedDefaultSlide(activeSlide);

  return {
    isNewStoryboard,
    shouldShow: !dismissed && isNewStoryboard,
  };
}
