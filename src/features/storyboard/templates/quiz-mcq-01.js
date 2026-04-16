import { QuizThumb } from "@/features/storyboard/templates/thumbnails";

export const quizMcq01Template = {
  id: "quiz-mcq-01",
  name: "Standard Knowledge Check",
  category: "assessment",
  screenType: "quiz",
  layout: "mcq-standard",
  description:
    "Multiple-choice knowledge check template for quick understanding verification.",
  intent: "Use when learners need a direct question with several response options.",
  usageHint: "Best for checkpoint questions and basic recall checks.",
  thumbnail: QuizThumb,
  defaultContent: {
    title: "Which statement is correct?",
    body: "Choose the best answer based on what you just learned.",
    cta: "Submit",
    quizOptions: [
      { text: "Correct answer option" },
      { text: "Plausible distractor" },
      { text: "Common misconception" },
      { text: "Less likely option" },
    ],
  },
  placeholderSchema: {
    title: "Enter the quiz question",
    body: "Add short answer instructions.",
    cta: "Submit",
    quizOptions: ["Option 1", "Option 2", "Option 3", "Option 4"],
  },
  editableFieldSchema: [
    { key: "title", label: "Question", input: "text", required: true },
    { key: "body", label: "Instruction Text", input: "textarea", required: true },
    { key: "cta", label: "Submit Label", input: "text", required: true },
    {
      key: "quizOptions",
      label: "Answer Options",
      input: "collection",
      itemShape: [{ key: "text", label: "Option", input: "text" }],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Use one clearly correct answer and plausible distractors.",
      "Keep the question stem concise and unambiguous.",
    ],
  },
  preview: {
    componentKey: "quiz",
    layout: "mcq-standard",
  },
  handoff: {
    buildNotes: [
      "Configure correct and incorrect states for each option.",
      "Add retry or feedback layers if the assessment requires remediation.",
    ],
  },
};
