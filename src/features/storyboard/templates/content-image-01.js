import { ContentImageThumb } from "@/features/storyboard/templates/thumbnails";

export const contentImage01Template = {
  id: "content-image-01",
  name: "Content with Image",
  category: "content",
  screenType: "content",
  layout: "text-left-image-right",
  description:
    "Balanced instructional content template with copy on the left and supporting media on the right.",
  intent: "Use when you need a straightforward explanation supported by a screenshot, diagram, or illustration.",
  usageHint: "Best for explanatory content with a supporting visual.",
  thumbnail: ContentImageThumb,
  defaultContent: {
    title: "Supply Chain Visibility",
    body: "Use this space for the main explanation, supporting context, and a clear action for the learner.",
    cta: "Next",
    contentBlocks: [
      {
        title: "Core Insight",
        content: "Use this block for the main concept or instructional message.",
      },
      {
        title: "Supporting Detail",
        content: "Add an example, note, or implementation detail here.",
      },
    ],
  },
  placeholderSchema: {
    title: "Enter content heading",
    body: "Add the main teaching point or explanation.",
    cta: "Next",
    contentBlocks: [
      { title: "Block 1", content: "Supporting detail" },
      { title: "Block 2", content: "Supporting detail" },
    ],
  },
  formSchema: {
    sections: [
      {
        id: "core-copy",
        title: "Core Copy",
        description: "Edit the main teaching copy and CTA for this content slide.",
        fields: [
          {
            id: "title",
            type: "text",
            label: "Title",
            helpText: "Use a specific, learner-friendly heading.",
            required: true,
            defaultValue: "Supply Chain Visibility",
          },
          {
            id: "body",
            type: "textarea",
            label: "Body Copy",
            helpText: "Summarize the concept, context, and learner takeaway.",
            required: true,
            defaultValue:
              "Use this space for the main explanation, supporting context, and a clear action for the learner.",
          },
          {
            id: "cta",
            type: "text",
            label: "CTA Label",
            helpText: "Keep the CTA short and action-oriented.",
            required: true,
            defaultValue: "Next",
          },
        ],
      },
      {
        id: "content-blocks",
        title: "Content Blocks",
        description: "Use short grouped blocks to support the main explanation.",
        fields: [
          {
            id: "contentBlocks",
            type: "repeater",
            label: "Content Blocks",
            helpText: "Each block should cover one key idea or example.",
            itemLabel: "Block",
            addLabel: "Add Block",
            min: 1,
            max: 5,
            itemFields: [
              {
                id: "title",
                type: "text",
                label: "Block Title",
                helpText: "Short label for the idea.",
                defaultValue: "",
              },
              {
                id: "content",
                type: "textarea",
                label: "Block Content",
                helpText: "Add the supporting detail or example.",
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
      key: "contentBlocks",
      label: "Content Blocks",
      input: "collection",
      itemShape: [
        { key: "title", label: "Block Title", input: "text" },
        { key: "content", label: "Block Content", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Pair each content block with a single idea.",
      "Use the right-side media zone for screenshots, diagrams, or illustration notes.",
    ],
  },
  preview: {
    componentKey: "content",
    layout: "text-left-image-right",
  },
  handoff: {
    buildNotes: [
      "Preserve the left/right balance when converting into Storyline.",
      "Use subtle image emphasis rather than heavy motion.",
    ],
  },
};
