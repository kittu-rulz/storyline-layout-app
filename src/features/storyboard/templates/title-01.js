import { TitleThumb } from "@/features/storyboard/templates/thumbnails";

export const title01Template = {
  id: "title-01",
  name: "Title Hero",
  category: "intro",
  screenType: "title",
  layout: "hero-center",
  description:
    "Centered hero template for section intros, lesson starts, and welcome moments.",
  intent: "Use when learners need a clear section opener or welcome screen before instruction begins.",
  usageHint: "Best for openings, intros, and section transitions.",
  thumbnail: TitleThumb,
  defaultContent: {
    title: "Welcome to the Course",
    body: "Build confidence with a clear introduction, supporting context, and a simple next step.",
    cta: "Continue",
    titleHighlights: [
      { text: "What you will learn" },
      { text: "Why it matters" },
      { text: "How to apply it" },
    ],
  },
  placeholderSchema: {
    title: "Enter welcome or section title",
    body: "Add a brief introduction for the learner.",
    cta: "Continue",
    titleHighlights: ["Highlight 1", "Highlight 2", "Highlight 3"],
  },
  formSchema: {
    sections: [
      {
        id: "core-copy",
        title: "Core Copy",
        description: "Edit the headline, supporting copy, and CTA for the opening slide.",
        fields: [
          {
            id: "title",
            type: "text",
            label: "Title",
            helpText: "Keep the opening title short and scannable.",
            required: true,
            defaultValue: "Welcome to the Course",
          },
          {
            id: "body",
            type: "textarea",
            label: "Body Copy",
            helpText: "Add a short orientation message for the learner.",
            required: true,
            defaultValue:
              "Build confidence with a clear introduction, supporting context, and a simple next step.",
          },
          {
            id: "cta",
            type: "text",
            label: "CTA Label",
            helpText: "Use a clear action like Continue or Start.",
            required: true,
            defaultValue: "Continue",
          },
        ],
      },
      {
        id: "highlights",
        title: "Highlights",
        description: "Short supporting points that reinforce the opening message.",
        fields: [
          {
            id: "titleHighlights",
            type: "repeater",
            label: "Highlights",
            helpText: "Use brief value statements rather than long sentences.",
            itemLabel: "Highlight",
            addLabel: "Add Highlight",
            min: 1,
            max: 5,
            itemFields: [
              {
                id: "text",
                type: "text",
                label: "Highlight Text",
                helpText: "Enter a short highlight.",
                defaultValue: "",
              },
            ],
          },
        ],
      },
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Body Copy", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "titleHighlights",
      label: "Highlights",
      input: "collection",
      itemShape: [{ key: "text", label: "Highlight", input: "text" }],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Keep the title concise and scannable.",
      "Use highlights for short value statements rather than paragraphs.",
    ],
  },
  preview: {
    componentKey: "title",
    layout: "hero-center",
  },
  handoff: {
    buildNotes: [
      "Use a clear visual focal point in the center of the slide.",
      "Animate the headline and CTA with a short entrance only.",
    ],
  },
};
