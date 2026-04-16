import { ClickRevealThumb } from "@/features/storyboard/templates/thumbnails";

export const clickReveal01Template = {
  id: "click-reveal-01",
  name: "Click Reveal Explorer",
  category: "interaction",
  screenType: "interaction",
  layout: "click-reveal",
  description:
    "Hotspot-style interaction template for exploring interface areas or layered details.",
  intent: "Use when learners should inspect parts of a visual or interface one area at a time.",
  usageHint: "Best for hotspot exploration and guided discovery.",
  thumbnail: ClickRevealThumb,
  defaultContent: {
    title: "Explore the Interface",
    body: "Select each hotspot to reveal what it does and why it matters.",
    cta: "Explore",
    hotspotItems: [
      { title: "Navigation", content: "Explain the purpose of the main navigation area." },
      { title: "Status Area", content: "Show what learners should notice in the status region." },
      { title: "Action Panel", content: "Describe the key controls available here." },
      { title: "Support Info", content: "Surface the guidance or detail tied to this zone." },
    ],
  },
  placeholderSchema: {
    title: "Enter interaction heading",
    body: "Add a brief instruction for the learner.",
    cta: "Explore",
    hotspotItems: [
      { title: "Hotspot 1", content: "Hotspot detail" },
      { title: "Hotspot 2", content: "Hotspot detail" },
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Instruction Text", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "hotspotItems",
      label: "Hotspots",
      input: "collection",
      itemShape: [
        { key: "title", label: "Hotspot Label", input: "text" },
        { key: "content", label: "Reveal Content", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Keep each hotspot tied to one clear learner takeaway.",
      "Use concise reveal text to maintain interaction flow.",
    ],
  },
  preview: {
    componentKey: "interaction",
    layout: "click-reveal",
  },
  handoff: {
    buildNotes: [
      "Map each hotspot to a visited state or reveal layer in Storyline.",
      "Consider preventing the CTA until all required hotspots are explored.",
    ],
  },
};
