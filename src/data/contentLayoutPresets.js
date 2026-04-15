export const contentLayoutPresets = [
  {
    value: "content-heavy",
    label: "Content Heavy",
    description: "Text-first layout with minimal media emphasis.",
    primaryLayout: "full-width-content",
    layouts: ["full-width-content"],
  },
  {
    value: "media-heavy",
    label: "Media Heavy",
    description: "Large visual area with supporting text.",
    primaryLayout: "image-top-text-bottom",
    layouts: ["image-top-text-bottom"],
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Split text and visual content evenly.",
    primaryLayout: "text-left-image-right",
    layouts: ["text-left-image-right", "image-left-text-right"],
  },
  {
    value: "quick-info",
    label: "Quick Info",
    description: "Compact key points for rapid scanning.",
    primaryLayout: "two-column-text",
    layouts: ["two-column-text"],
  },
];
