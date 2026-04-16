import { ProcessThumb } from "@/features/storyboard/templates/thumbnails";

export const process01Template = {
  id: "process-01",
  name: "Process Steps",
  category: "process",
  screenType: "process",
  layout: "horizontal-steps",
  description:
    "Sequential process template for workflows, procedures, and task walkthroughs.",
  intent: "Use when the learning content needs a clear ordered sequence of actions or stages.",
  usageHint: "Best for step-by-step process and task walkthroughs.",
  thumbnail: ProcessThumb,
  defaultContent: {
    title: "Order Fulfillment Process",
    body: "Follow each stage in sequence to understand how requests move from intake to completion.",
    cta: "Continue",
    processSteps: [
      {
        title: "Receive Request",
        description: "Capture scope, timing, and success criteria.",
      },
      {
        title: "Validate Details",
        description: "Confirm dependencies and required inputs.",
      },
      {
        title: "Execute Task",
        description: "Complete the core action and monitor quality.",
      },
      {
        title: "Confirm Completion",
        description: "Share outcomes and confirm closure with stakeholders.",
      },
    ],
  },
  placeholderSchema: {
    title: "Enter process title",
    body: "Add a short overview of the sequence.",
    cta: "Continue",
    processSteps: [
      { title: "Step 1", description: "What happens here" },
      { title: "Step 2", description: "What happens here" },
    ],
  },
  formSchema: {
    sections: [
      {
        id: "core-copy",
        title: "Core Copy",
        description: "Set the process heading, context, and learner action.",
        fields: [
          {
            id: "title",
            type: "text",
            label: "Title",
            helpText: "Summarize the process learners are following.",
            required: true,
            defaultValue: "Order Fulfillment Process",
          },
          {
            id: "body",
            type: "textarea",
            label: "Body Copy",
            helpText: "Explain the overall flow before the steps begin.",
            required: true,
            defaultValue:
              "Follow each stage in sequence to understand how requests move from intake to completion.",
          },
          {
            id: "cta",
            type: "text",
            label: "CTA Label",
            helpText: "Use the action learners take after reviewing the process.",
            required: true,
            defaultValue: "Continue",
          },
        ],
      },
      {
        id: "process-steps",
        title: "Process Steps",
        description: "Add the step sequence and supporting detail for each stage.",
        fields: [
          {
            id: "processSteps",
            type: "repeater",
            label: "Steps",
            helpText: "Keep the sequence ordered and action-based.",
            itemLabel: "Step",
            addLabel: "Add Step",
            min: 2,
            max: 6,
            itemFields: [
              {
                id: "title",
                type: "text",
                label: "Step Title",
                helpText: "Action-oriented step name.",
                defaultValue: "",
              },
              {
                id: "description",
                type: "textarea",
                label: "Step Description",
                helpText: "Short explanation of what happens in this step.",
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
      key: "processSteps",
      label: "Steps",
      input: "collection",
      itemShape: [
        { key: "title", label: "Step Title", input: "text" },
        { key: "description", label: "Step Description", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Make each step title action-oriented.",
      "Keep descriptions brief enough to scan in sequence.",
    ],
  },
  preview: {
    componentKey: "process",
    layout: "horizontal-steps",
  },
  handoff: {
    buildNotes: [
      "Map each step to a consistent card or marker state.",
      "Use progressive reveal or selected-state emphasis for clarity.",
    ],
  },
};
