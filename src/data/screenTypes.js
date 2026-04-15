export const screenTypeCategoryOrder = [
  "intro-structure",
  "content",
  "interaction",
  "practice",
  "assessment",
];

export const screenTypeCategoryLabels = {
  "intro-structure": "Intro & Structure",
  content: "Content",
  interaction: "Interaction",
  practice: "Practice",
  assessment: "Assessment",
};

export const screenTypes = {
  title: {
    category: "intro-structure",
    name: "Title / Section Screen",
    description: "Hero-style intro screen with title, subtitle, and CTA.",
    defaults: {
      title: "Welcome to the Course",
      body: "Build confidence with a clean visual introduction and a clear next step.",
      cta: "Continue",
      layout: "hero-center",
      titleHighlights: [
        { text: "What you will learn" },
        { text: "Why it matters" },
        { text: "How to apply it" },
      ],
    },
  },
  content: {
    category: "content",
    name: "Content Screen",
    description: "Structured learning screen with title, text, and media area.",
    defaults: {
      title: "Supply Chain Visibility",
      body: "Use this area for body copy, key learning points, or short process explanations. The layout is designed to import cleanly into Storyline as a visual guide.",
      cta: "Next",
      layout: "text-left-image-right",
      contentBlocks: [
        {
          title: "Core Insight",
          content: "Use this block for your primary explanation or key concept.",
        },
        {
          title: "Supporting Detail",
          content:
            "Use this block for examples, process notes, or implementation guidance.",
        },
      ],
    },
  },
  objectives: {
    category: "intro-structure",
    name: "Objectives Screen",
    description: "Learning goals screen with clear outcomes and focus points.",
    defaults: {
      title: "Learning Objectives",
      body: "By the end of this lesson, you should be able to explain key concepts and apply them in realistic scenarios.",
      cta: "Start Learning",
      layout: "objectives-list",
      objectivesItems: [
        { text: "Define the core concept in plain language." },
        { text: "Identify common errors and prevention steps." },
        { text: "Apply the concept in a practical scenario." },
        { text: "Evaluate outcomes and improve next actions." },
      ],
    },
  },
  process: {
    category: "practice",
    name: "Process / Steps Screen",
    description: "Step-by-step sequence layout for workflows and procedures.",
    defaults: {
      title: "Order Fulfillment Process",
      body: "Follow each stage in sequence to understand how requests move from intake to completion.",
      cta: "Continue",
      layout: "horizontal-steps",
      processSteps: [
        {
          title: "Receive Request",
          description: "Capture requirements, scope, and delivery constraints.",
        },
        {
          title: "Validate Details",
          description: "Confirm prerequisites, approvals, and dependencies.",
        },
        {
          title: "Execute Task",
          description: "Complete the core action sequence and monitor quality.",
        },
        {
          title: "Confirm Completion",
          description: "Share outcomes and confirm closure with stakeholders.",
        },
      ],
    },
  },
  comparison: {
    category: "content",
    name: "Compare / Contrast Screen",
    description: "Side-by-side comparison of options, approaches, or scenarios.",
    defaults: {
      title: "Compare the Two Approaches",
      body: "Review key differences across criteria so learners can select the best-fit approach.",
      cta: "Continue",
      layout: "comparison-side-by-side",
      comparisonRows: [
        {
          criterion: "Speed",
          left: "Faster rollout",
          right: "Moderate rollout",
        },
        {
          criterion: "Complexity",
          left: "Lower complexity",
          right: "Higher complexity",
        },
        {
          criterion: "Best Use",
          left: "Quick wins",
          right: "Deep capability",
        },
      ],
    },
  },
  timeline: {
    category: "content",
    name: "Timeline Screen",
    description: "Chronological sequence for phases, milestones, or events.",
    defaults: {
      title: "Project Timeline",
      body: "Use a clear sequence to show how milestones unfold over time.",
      cta: "Next Milestone",
      layout: "timeline-horizontal",
      timelineEvents: [
        {
          title: "Kickoff",
          detail: "Define scope, stakeholders, and delivery milestones.",
        },
        {
          title: "Design",
          detail: "Create the content and interaction blueprint.",
        },
        {
          title: "Build",
          detail: "Develop Storyline slides, states, and triggers.",
        },
        {
          title: "Launch",
          detail: "Deploy, validate tracking, and monitor outcomes.",
        },
      ],
    },
  },
  summary: {
    category: "intro-structure",
    name: "Summary Screen",
    description: "End-of-section recap with key takeaways and next action.",
    defaults: {
      title: "Key Takeaways",
      body: "Review the essential points before moving to the next topic or assessment.",
      cta: "Next Module",
      layout: "key-takeaways",
      summaryPoints: [
        { text: "I can explain the core concept in simple terms." },
        { text: "I understand the key steps in the process." },
        { text: "I can apply this in a practical context." },
        { text: "I know the next action to take." },
      ],
    },
  },
  tabs: {
    category: "interaction",
    name: "Tabs Interaction",
    description: "Tabbed interaction layout to organize related content chunks.",
    defaults: {
      title: "Explore Each Category",
      body: "Select a tab to reveal focused content for that topic area.",
      cta: "Continue",
      layout: "tabs-top-content",
      tabsItems: [
        {
          title: "Overview",
          content: "Introduce the high-level concept for this category.",
        },
        {
          title: "Details",
          content: "Add supporting detail, guidance, or key definitions.",
        },
        {
          title: "Examples",
          content: "Show practical examples learners can apply.",
        },
      ],
    },
  },
  scenario: {
    category: "practice",
    name: "Scenario-Based Screen",
    description: "Decision-based scenario with learner choices and consequences.",
    defaults: {
      title: "Customer Conversation Scenario",
      body: "Read the scenario and choose the best response path before viewing the outcome.",
      cta: "Continue Scenario",
      layout: "scenario-branching",
      scenarioOptions: [
        {
          title: "Response Path 1",
          detail: "Acknowledge concern and ask a clarifying question.",
        },
        {
          title: "Response Path 2",
          detail: "Offer a direct recommendation based on known constraints.",
        },
        {
          title: "Response Path 3",
          detail: "Escalate to a specialist with context summary.",
        },
        {
          title: "Response Path 4",
          detail: "Document next steps and confirm follow-up timing.",
        },
      ],
    },
  },
  reflection: {
    category: "intro-structure",
    name: "Reflection Screen",
    description: "Prompt learners to pause, reflect, and connect ideas to practice.",
    defaults: {
      title: "Reflection Prompt",
      body: "Consider how you will apply this concept in your own context.",
      cta: "Continue",
      layout: "reflection-prompt",
      reflectionChecks: [
        { text: "I can explain this concept in my own words." },
        { text: "I know where to apply it in my workflow." },
        { text: "I can identify one concrete next action." },
      ],
    },
  },
  accordionInteraction: {
    category: "interaction",
    name: "Accordion Interaction Screen",
    description: "Expandable sections for progressive disclosure interactions.",
    defaults: {
      title: "Explore Each Topic",
      body: "Expand each section to reveal details and keep information digestible.",
      cta: "Continue",
      layout: "accordion-panels",
      accordionSections: [
        {
          title: "Section 1",
          content: "Primary explanation for the first accordion section.",
        },
        {
          title: "Section 2",
          content: "Follow-up detail for the second accordion section.",
        },
        {
          title: "Section 3",
          content: "Additional guidance for the final accordion section.",
        },
      ],
    },
  },
  interaction: {
    category: "interaction",
    name: "Interaction Screen",
    description:
      "Click-and-reveal style layout with hotspots and an information panel.",
    defaults: {
      title: "Explore the Interface",
      body: "Click each hotspot to learn more about the feature. This layout helps you plan an interaction before building triggers in Storyline.",
      cta: "Explore",
      layout: "click-reveal",
      hotspotItems: [
        {
          title: "Hotspot 1",
          content: "Explain the first interface area and its function.",
        },
        {
          title: "Hotspot 2",
          content: "Explain the second interface area and usage guidance.",
        },
        {
          title: "Hotspot 3",
          content: "Explain the third interface area and related behavior.",
        },
        {
          title: "Hotspot 4",
          content: "Explain the final interface area and learner action.",
        },
      ],
    },
  },
  quiz: {
    category: "assessment",
    name: "Knowledge Check",
    description: "Question-and-options layout for quiz or checkpoint slides.",
    defaults: {
      title: "Which statement is correct?",
      body: "Choose the best answer based on what you just learned.",
      cta: "Submit",
      layout: "mcq-standard",
      quizOptions: [
        { text: "Option 1" },
        { text: "Option 2" },
        { text: "Option 3" },
        { text: "Option 4" },
      ],
    },
  },
};
