import { ScenarioThumb } from "@/features/storyboard/templates/thumbnails";

export const scenarioDecision01Template = {
  id: "scenario-decision-01",
  name: "Decision Scenario",
  category: "scenario",
  screenType: "scenario",
  layout: "scenario-decision-grid",
  description:
    "Decision-focused branching scenario template for judging options and consequences.",
  intent: "Use when learners must evaluate choices, consequences, and best-response paths.",
  usageHint: "Best for branching decisions and consequence-based practice.",
  thumbnail: ScenarioThumb,
  defaultContent: {
    title: "Choose the Best Response",
    body: "Review the situation and decide which action leads to the best outcome for the learner goal.",
    cta: "Continue Scenario",
    scenarioOptions: [
      { title: "Ask a Clarifying Question", detail: "Gather just enough context before acting." },
      { title: "Offer a Direct Recommendation", detail: "Provide a clear next step based on the available facts." },
      { title: "Escalate with Context", detail: "Bring in support while preserving decision quality." },
      { title: "Document and Confirm", detail: "Close the loop with a clear summary and follow-up." },
    ],
  },
  placeholderSchema: {
    title: "Enter scenario title",
    body: "Describe the scenario and learner goal.",
    cta: "Continue Scenario",
    scenarioOptions: [
      { title: "Choice 1", detail: "Choice detail" },
      { title: "Choice 2", detail: "Choice detail" },
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Scenario Prompt", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "scenarioOptions",
      label: "Decision Paths",
      input: "collection",
      itemShape: [
        { key: "title", label: "Choice Title", input: "text" },
        { key: "detail", label: "Choice Detail", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Make each option meaningfully distinct.",
      "Write consequences so they can map naturally into feedback layers.",
    ],
  },
  preview: {
    componentKey: "scenario",
    layout: "scenario-decision-grid",
  },
  handoff: {
    buildNotes: [
      "Map each choice to a feedback layer or branch state.",
      "Use consequence text to inform the follow-up slide or decision state.",
    ],
  },
};
