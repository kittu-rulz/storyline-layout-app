import { TabsThumb } from "@/features/storyboard/templates/thumbnails";

export const tabs01Template = {
  id: "tabs-01",
  name: "Tabbed Explore",
  category: "interaction",
  screenType: "tabs",
  layout: "tabs-top-content",
  description:
    "Top-tab interaction template for organizing related ideas into a simple reveal pattern.",
  intent: "Use when learners should browse a few related topics without leaving the slide.",
  usageHint: "Use for tabbed interactions and grouped topic exploration.",
  thumbnail: TabsThumb,
  defaultContent: {
    title: "Explore Each Category",
    body: "Select a tab to reveal focused content for that topic area.",
    cta: "Continue",
    tabsItems: [
      { title: "Overview", content: "Introduce the core concept for this tab." },
      { title: "Details", content: "Add supporting detail, guidance, or definitions." },
      { title: "Examples", content: "Show an applied example or use case." },
    ],
  },
  placeholderSchema: {
    title: "Enter tabbed interaction title",
    body: "Add short directions for the learner.",
    cta: "Continue",
    tabsItems: [
      { title: "Tab 1", content: "Tab content" },
      { title: "Tab 2", content: "Tab content" },
    ],
  },
  formSchema: {
    sections: [
      {
        id: "core-copy",
        title: "Core Copy",
        description: "Set the tab interaction heading, instructions, and CTA.",
        fields: [
          {
            id: "title",
            type: "text",
            label: "Title",
            helpText: "Frame what the learner should explore.",
            required: true,
            defaultValue: "Explore Each Category",
          },
          {
            id: "body",
            type: "textarea",
            label: "Body Copy",
            helpText: "Add a short instruction for using the tabs.",
            required: true,
            defaultValue: "Select a tab to reveal focused content for that topic area.",
          },
          {
            id: "cta",
            type: "text",
            label: "CTA Label",
            helpText: "Use the CTA learners should take after exploring.",
            required: true,
            defaultValue: "Continue",
          },
        ],
      },
      {
        id: "tab-items",
        title: "Tab Content",
        description: "Add the labels and learner-facing content for each tab.",
        fields: [
          {
            id: "tabsItems",
            type: "repeater",
            label: "Tabs",
            helpText: "Keep tab labels short and the content focused.",
            itemLabel: "Tab",
            addLabel: "Add Tab",
            min: 2,
            max: 6,
            itemFields: [
              {
                id: "title",
                type: "text",
                label: "Tab Label",
                helpText: "Short label for the tab.",
                defaultValue: "",
              },
              {
                id: "content",
                type: "textarea",
                label: "Tab Content",
                helpText: "Add the reveal content for this tab.",
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
    { key: "body", label: "Instruction Text", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "tabsItems",
      label: "Tabs",
      input: "collection",
      itemShape: [
        { key: "title", label: "Tab Label", input: "text" },
        { key: "content", label: "Tab Content", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Use short tab labels for clean navigation.",
      "Keep each tab focused on a single subtopic.",
    ],
  },
  preview: {
    componentKey: "tabs",
    layout: "tabs-top-content",
  },
  handoff: {
    buildNotes: [
      "Use selected and visited states for each tab.",
      "The CTA can remain disabled until required tabs are reviewed if desired.",
    ],
  },
};
