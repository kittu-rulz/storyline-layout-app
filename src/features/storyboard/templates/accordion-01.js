import { AccordionThumb } from "@/features/storyboard/templates/thumbnails";

export const accordion01Template = {
  id: "accordion-01",
  name: "Accordion Explore",
  category: "interaction",
  screenType: "accordionInteraction",
  layout: "accordion-panels",
  description:
    "Accordion interaction template for progressive disclosure of detailed content.",
  intent: "Use when learners should expand topics one at a time to reduce cognitive load.",
  usageHint: "Best for layered explanations and progressive disclosure.",
  thumbnail: AccordionThumb,
  defaultContent: {
    title: "Explore Each Topic",
    body: "Open each section to reveal the detail most relevant to that concept.",
    cta: "Continue",
    accordionSections: [
      { title: "What It Is", content: "Define the concept in a learner-friendly way." },
      { title: "Why It Matters", content: "Explain the impact or reason this topic matters." },
      { title: "How to Apply It", content: "Show the practical action or next step." },
    ],
  },
  placeholderSchema: {
    title: "Enter accordion heading",
    body: "Add a short instruction.",
    cta: "Continue",
    accordionSections: [
      { title: "Section 1", content: "Section content" },
      { title: "Section 2", content: "Section content" },
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Instruction Text", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "accordionSections",
      label: "Accordion Sections",
      input: "collection",
      itemShape: [
        { key: "title", label: "Section Title", input: "text" },
        { key: "content", label: "Section Content", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Keep section titles short and meaningful.",
      "Use the accordion to reveal depth gradually, not all at once.",
    ],
  },
  preview: {
    componentKey: "accordionInteraction",
    layout: "accordion-panels",
  },
  handoff: {
    buildNotes: [
      "Use visited and expanded states for each panel.",
      "This format works well for long-form detail without cluttering the slide.",
    ],
  },
};
