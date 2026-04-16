import { TitleThumb } from "@/features/storyboard/templates/thumbnails";

export const agenda01Template = {
  id: "agenda-01",
  name: "Section Agenda",
  category: "intro",
  screenType: "objectives",
  layout: "two-column-objectives",
  description:
    "Agenda-style template for previewing the main topics or flow of a section.",
  intent: "Use when you want to orient learners before diving into detailed content.",
  usageHint: "Best for module overviews and topic roadmaps.",
  thumbnail: TitleThumb,
  defaultContent: {
    title: "Today’s Agenda",
    body: "This section follows a simple sequence so learners know what is coming next and why each topic matters.",
    cta: "Begin",
    objectivesItems: [
      { text: "Overview and key concepts" },
      { text: "Guided examples" },
      { text: "Interactive practice" },
      { text: "Knowledge check and next steps" },
    ],
  },
  placeholderSchema: {
    title: "Enter agenda heading",
    body: "Add a short orientation statement.",
    cta: "Begin",
    objectivesItems: ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Intro Copy", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "objectivesItems",
      label: "Agenda Items",
      input: "collection",
      itemShape: [{ key: "text", label: "Agenda Item", input: "text" }],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Use this to frame the lesson path before the details begin.",
      "Keep agenda items brief and parallel in wording.",
    ],
  },
  preview: {
    componentKey: "objectives",
    layout: "two-column-objectives",
  },
  handoff: {
    buildNotes: [
      "Consider numbering or simple icon markers for each agenda item.",
      "This layout works well as a calm orientation screen before interaction begins.",
    ],
  },
};
