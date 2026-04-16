import { TitleThumb } from "@/features/storyboard/templates/thumbnails";

export const objectives01Template = {
  id: "objectives-01",
  name: "Learning Objectives",
  category: "intro",
  screenType: "objectives",
  layout: "objectives-list",
  description:
    "Clear outcome-driven objectives template for the start of a lesson or section.",
  intent: "Use when you need to set expectations and define what learners should be able to do.",
  usageHint: "Best for lesson goals and measurable outcomes.",
  thumbnail: TitleThumb,
  defaultContent: {
    title: "Learning Objectives",
    body: "By the end of this section, learners should know what to do, why it matters, and how to apply it.",
    cta: "Start Learning",
    objectivesItems: [
      { text: "Define the key concept in practical terms." },
      { text: "Recognize common issues and prevention steps." },
      { text: "Apply the concept in a realistic workflow." },
      { text: "Choose the correct next action with confidence." },
    ],
  },
  placeholderSchema: {
    title: "Enter the learning objective heading",
    body: "Add a short summary explaining what learners will achieve.",
    cta: "Start Learning",
    objectivesItems: [
      "Objective 1",
      "Objective 2",
      "Objective 3",
      "Objective 4",
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Body Copy", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "objectivesItems",
      label: "Objectives",
      input: "collection",
      itemShape: [{ key: "text", label: "Objective", input: "text" }],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Write objectives as observable learner outcomes.",
      "Keep each objective concise and action-oriented.",
    ],
  },
  preview: {
    componentKey: "objectives",
    layout: "objectives-list",
  },
  handoff: {
    buildNotes: [
      "Reveal each objective in sequence if desired.",
      "Keep the list scannable with even spacing and strong verbs.",
    ],
  },
};
