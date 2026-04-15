import {
  CUSTOM_SLIDE_SIZE_PRESET,
  DEFAULT_SLIDE_SIZE_PRESET,
  slideSizePresets,
} from "@/data/slideSizes";

const presetMap = Object.fromEntries(
  slideSizePresets.map((preset) => [preset.value, preset]),
);

const defaultPreset = presetMap[DEFAULT_SLIDE_SIZE_PRESET];

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function getSlideSizePreset(value) {
  return presetMap[value] ?? defaultPreset;
}

export function getResolvedSlideSize(form) {
  const selectedPreset = getSlideSizePreset(form.slideSizePreset);

  if (selectedPreset.value !== CUSTOM_SLIDE_SIZE_PRESET) {
    return {
      width: selectedPreset.width,
      height: selectedPreset.height,
      label: selectedPreset.label,
    };
  }

  const width = toPositiveInteger(form.customSlideSize?.width, defaultPreset.width);
  const height = toPositiveInteger(
    form.customSlideSize?.height,
    defaultPreset.height,
  );

  return {
    width,
    height,
    label: `Custom (${width} x ${height})`,
  };
}

export function getSlideAspectRatioStyle(form) {
  const { width, height } = getResolvedSlideSize(form);

  return {
    aspectRatio: `${width} / ${height}`,
  };
}

export function sanitizeCustomSlideSizeValue(value, fallback) {
  return toPositiveInteger(value, fallback);
}
