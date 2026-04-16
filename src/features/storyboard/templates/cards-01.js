import { ContentImageThumb } from "@/features/storyboard/templates/thumbnails";

export const cards01Template = {
  id: "cards-01",
  name: "Key Concept Cards",
  category: "content",
  screenType: "content",
  layout: "two-column-text",
  description:
    "Card-style content template for short grouped concepts, principles, or examples.",
  intent: "Use when you need to break content into a few scannable chunks instead of long paragraphs.",
  usageHint: "Best for grouped concepts and quick reference points.",
  thumbnail: ContentImageThumb,
  defaultContent: {
    title: "Core Principles at a Glance",
    body: "Use these cards to reinforce the main ideas learners should remember and apply.",
    cta: "Next",
    contentBlocks: [
      { title: "Principle 1", content: "Explain the first key concept in one or two sentences." },
      { title: "Principle 2", content: "Add the second concept or supporting idea here." },
      { title: "Principle 3", content: "Highlight the final takeaway or example." },
    ],
  },
  placeholderSchema: {
    title: "Enter cards heading",
    body: "Add a short setup sentence.",
    cta: "Next",
    contentBlocks: [
      { title: "Card 1", content: "Card content" },
      { title: "Card 2", content: "Card content" },
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Intro Copy", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "contentBlocks",
      label: "Cards",
      input: "collection",
      itemShape: [
        { key: "title", label: "Card Title", input: "text" },
        { key: "content", label: "Card Content", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Aim for one idea per card.",
      "Use parallel card titles for easier scanning.",
    ],
  },
  preview: {
    componentKey: "content",
    layout: "two-column-text",
  },
  handoff: {
    buildNotes: [
      "Treat each block as a reusable content card or tile in Storyline.",
      "Keep card text short enough to avoid crowding.",
    ],
  },
};
