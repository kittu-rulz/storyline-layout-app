export const DEFAULT_SAFE_AREA_PRESET = "standard-storyline";

export const safeAreaPresets = [
  {
    value: "standard-storyline",
    label: "Standard Storyline",
    margins: {
      top: 120,
      bottom: 140,
      left: 120,
      right: 120,
    },
  },
  {
    value: "caption-heavy",
    label: "Caption Heavy",
    margins: {
      top: 120,
      bottom: 220,
      left: 120,
      right: 120,
    },
  },
  {
    value: "player-heavy",
    label: "Player Heavy",
    margins: {
      top: 140,
      bottom: 260,
      left: 140,
      right: 140,
    },
  },
  {
    value: "clean-fullscreen",
    label: "Clean Fullscreen",
    margins: {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
    },
  },
];
