import { TimelineThumb } from "@/features/storyboard/templates/thumbnails";

export const timeline01Template = {
  id: "timeline-01",
  name: "Milestone Timeline",
  category: "process",
  screenType: "timeline",
  layout: "timeline-horizontal",
  description:
    "Milestone-based template for showing phases, checkpoints, and chronological flow.",
  intent: "Use when the learning story depends on sequence, timing, or phases over time.",
  usageHint: "Best for milestones, phases, and chronological sequences.",
  thumbnail: TimelineThumb,
  defaultContent: {
    title: "Implementation Timeline",
    body: "Walk learners through the key milestones so they can understand how work progresses over time.",
    cta: "Continue",
    timelineEvents: [
      { title: "Prepare", detail: "Gather inputs, align owners, and define success criteria." },
      { title: "Build", detail: "Create the assets, configure logic, and test core paths." },
      { title: "Review", detail: "Validate quality and resolve any open issues." },
      { title: "Launch", detail: "Deploy the experience and monitor early feedback." },
    ],
  },
  placeholderSchema: {
    title: "Enter timeline heading",
    body: "Explain the sequence at a high level.",
    cta: "Continue",
    timelineEvents: [
      { title: "Phase 1", detail: "Milestone detail" },
      { title: "Phase 2", detail: "Milestone detail" },
    ],
  },
  editableFieldSchema: [
    { key: "title", label: "Title", input: "text", required: true },
    { key: "body", label: "Context", input: "textarea", required: true },
    { key: "cta", label: "CTA Label", input: "text", required: true },
    {
      key: "timelineEvents",
      label: "Timeline Events",
      input: "collection",
      itemShape: [
        { key: "title", label: "Event Title", input: "text" },
        { key: "detail", label: "Event Detail", input: "textarea" },
      ],
    },
  ],
  validationHints: {
    requiredFields: ["title", "body", "cta"],
    suggestions: [
      "Use a consistent milestone structure across all events.",
      "Keep event descriptions concise and time-oriented.",
    ],
  },
  preview: {
    componentKey: "timeline",
    layout: "timeline-horizontal",
  },
  handoff: {
    buildNotes: [
      "Use visited or progressive states if learners should step through the timeline.",
      "Emphasize the current milestone with a strong visual state.",
    ],
  },
};
