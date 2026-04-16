import { ContentImageThumb } from "@/features/storyboard/templates/thumbnails";

export const comparison01Template = {
  id: "comparison-01",
  name: "Compare Options",
  category: "content",
  screenType: "comparison",
  layout: "comparison-side-by-side",
  description:
    "Structured comparison template for alternatives, approaches, or decision criteria.",
  intent: "Use when learners need to distinguish between two choices or strategies.",
  usageHint: "Best for compare-and-contrast decisions.",
  thumbnail: ContentImageThumb,
  defaultContent: {
    title: "Compare the Two Approaches",
    body: "Review the differences across the most important criteria before making a recommendation.",
    cta: "Continue",
    comparisonRows: [
      { criterion: "Best For", left: "Quick implementation", right: "Long-term scalability" },
      { criterion: "Effort", left: "Lower setup effort", right: "Higher setup effort" },
      { criterion: "Risk", left: "Lower initial risk", right: "Broader change impact" },
    ],
  },
  placeholderSchema: {
    title: "Enter comparison heading",
    body: "Explain what learners should compare.",
    cta: "Continue",
    comparisonRows: [
      { criterion: "Criteria", left: "Option A", right: "Option B" },
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Context", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "comparisonRows",
      label: "Comparison Rows",
      input: "collection",
      itemShape: [
        { key: "criterion", label: "Criterion", input: "text" },
        { key: "left", label: "Left Column", input: "text" },
        { key: "right", label: "Right Column", input: "text" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Use consistent criteria so learners can scan both sides quickly.",
      "Keep row labels short and decision-focused.",
    ],
  },
  preview: {
    componentKey: "comparison",
    layout: "comparison-side-by-side",
  },
  handoff: {
    buildNotes: [
      "Use clear contrast styling without overwhelming the learner.",
      "Maintain equal visual weight between both options.",
    ],
  },
};
