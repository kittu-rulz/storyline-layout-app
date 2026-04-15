export const CUSTOM_SLIDE_SIZE_PRESET = "custom";
export const DEFAULT_SLIDE_SIZE_PRESET = "full-hd";

export const slideSizePresets = [
  {
    value: "storyline-16-9",
    label: "Storyline 16:9 (1280 x 720)",
    width: 1280,
    height: 720,
  },
  {
    value: "full-hd",
    label: "Full HD (1920 x 1080)",
    width: 1920,
    height: 1080,
  },
  {
    value: "storyline-4-3",
    label: "Storyline 4:3 (720 x 540)",
    width: 720,
    height: 540,
  },
  {
    value: CUSTOM_SLIDE_SIZE_PRESET,
    label: "Custom",
  },
];
