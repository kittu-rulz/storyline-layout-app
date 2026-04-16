import {
  screenTypeCategoryLabels,
  screenTypeCategoryOrder,
} from "@/data/screenTypes";

export const LAYOUT_DESCRIPTIONS = {
  "hero-center": "Centered intro layout for section starts and welcome screens.",
  "text-left-image-right": "Copy-first layout with supporting media.",
  "image-left-text-right": "Media-led layout for screenshots and examples.",
  "full-width-content": "Single-column reading layout for dense explanations.",
  "image-top-text-bottom": "Hero media on top with explanation below.",
  "two-column-text": "Parallel text blocks for split concepts.",
  "objectives-list": "Outcome-focused list of learning goals.",
  "two-column-objectives": "Grouped outcomes with clearer scanning.",
  "horizontal-steps": "Equal-weight step sequence across the slide.",
  "timeline-vertical": "Stacked workflow or process walkthrough.",
  "comparison-side-by-side": "Direct side-by-side comparison.",
  "comparison-pros-cons": "Tradeoff framing for decisions.",
  "timeline-horizontal": "Milestones mapped across a horizontal flow.",
  "timeline-milestones": "Milestone-led progression with checkpoints.",
  "key-takeaways": "Recap block for essential ideas and next actions.",
  "summary-checklist": "Checklist-style confirmation summary.",
  "tabs-top-content": "Tabbed reveal for grouped content.",
  "scenario-branching": "Scenario prompt with learner response paths.",
  "scenario-decision-grid": "Visible decision grid for multiple choices.",
  "reflection-prompt": "Prompt-led reflection moment.",
  "reflection-checkpoint": "Short checkpoint before continuing.",
  "accordion-panels": "Expandable sections for progressive disclosure.",
  "accordion-steps": "Accordion structure framed as a walkthrough.",
  "click-reveal": "Hotspots that reveal contextual information.",
  "tabs-interaction": "Interactive tabs with stateful content.",
  "process-steps": "State-based step interaction with detail panel.",
  accordion: "Expandable interaction for layered information.",
  "mcq-standard": "Standard multiple-choice knowledge check.",
};

export function buildScreenTypeGroups(screenTypes) {
  const entries = Object.entries(screenTypes);
  const groups = screenTypeCategoryOrder
    .map((category) => ({
      category,
      label: screenTypeCategoryLabels[category] || category,
      items: entries.filter(([, value]) => value.category === category),
    }))
    .filter((group) => group.items.length > 0);
  const groupedKeys = new Set(groups.flatMap((group) => group.items.map(([key]) => key)));
  const uncategorized = entries.filter(([key]) => !groupedKeys.has(key));

  if (uncategorized.length > 0) {
    groups.push({ category: "other", label: "Other", items: uncategorized });
  }

  return groups;
}

function createTextEditor({ title, description, itemLabel, addLabel, items, add, remove, update, placeholder }) {
  return {
    title,
    description,
    itemLabel,
    addLabel,
    items,
    fields: [{ key: "text", label: itemLabel, placeholder }],
    onAdd: add,
    onRemove: remove,
    onChange: (index, _key, value) => update(index, value),
  };
}

function createStructuredEditor({ title, description, itemLabel, addLabel, items, add, remove, update, fields }) {
  return {
    title,
    description,
    itemLabel,
    addLabel,
    items,
    fields,
    onAdd: add,
    onRemove: remove,
    onChange: (index, key, value) => update(index, key, value),
  };
}

export function buildEditorConfigs(form, formActions) {
  const configs = [];

  if (form.screenType === "title") {
    configs.push(
      createTextEditor({
        title: "Title Highlights",
        description: "Supporting chips shown on the intro screen.",
        itemLabel: "Highlight",
        addLabel: "Add Highlight",
        items: Array.isArray(form.titleHighlights) ? form.titleHighlights : [],
        add: formActions.addTitleHighlight,
        remove: formActions.removeTitleHighlight,
        update: formActions.updateTitleHighlight,
        placeholder: "What learners will see",
      }),
    );
  }

  if (form.screenType === "content") {
    configs.push(
      createStructuredEditor({
        title: "Content Blocks",
        description: "Secondary structure for content-heavy layouts.",
        itemLabel: "Block",
        addLabel: "Add Block",
        items: Array.isArray(form.contentBlocks) ? form.contentBlocks : [],
        add: formActions.addContentBlock,
        remove: formActions.removeContentBlock,
        update: formActions.updateContentBlock,
        fields: [
          { key: "title", label: "Block Title", placeholder: "Core insight" },
          { key: "content", label: "Block Content", placeholder: "Supporting explanation" },
        ],
      }),
    );
  }

  if (form.screenType === "objectives") {
    configs.push(
      createTextEditor({
        title: "Objectives",
        description: "Learner outcomes shown in the objectives screen.",
        itemLabel: "Objective",
        addLabel: "Add Objective",
        items: Array.isArray(form.objectivesItems) ? form.objectivesItems : [],
        add: formActions.addObjectiveItem,
        remove: formActions.removeObjectiveItem,
        update: formActions.updateObjectiveItem,
        placeholder: "Learner will be able to...",
      }),
    );
  }

  if (form.screenType === "comparison") {
    configs.push(
      createStructuredEditor({
        title: "Comparison Rows",
        description: "Criteria and side-by-side details for compare screens.",
        itemLabel: "Row",
        addLabel: "Add Row",
        items: Array.isArray(form.comparisonRows) ? form.comparisonRows : [],
        add: formActions.addComparisonRow,
        remove: formActions.removeComparisonRow,
        update: formActions.updateComparisonRow,
        fields: [
          { key: "criterion", label: "Criteria", placeholder: "Speed" },
          { key: "left", label: "Left Side", placeholder: "Faster rollout" },
          { key: "right", label: "Right Side", placeholder: "Higher complexity" },
        ],
      }),
    );
  }

  if (form.screenType === "timeline") {
    configs.push(
      createStructuredEditor({
        title: "Timeline Events",
        description: "Chronological steps, milestones, or phases.",
        itemLabel: "Event",
        addLabel: "Add Event",
        items: Array.isArray(form.timelineEvents) ? form.timelineEvents : [],
        add: formActions.addTimelineEvent,
        remove: formActions.removeTimelineEvent,
        update: formActions.updateTimelineEvent,
        fields: [
          { key: "title", label: "Event Title", placeholder: "Kickoff" },
          { key: "detail", label: "Event Detail", placeholder: "What happens during this phase" },
        ],
      }),
    );
  }

  if (form.screenType === "summary") {
    configs.push(
      createTextEditor({
        title: "Takeaways",
        description: "End-of-section recap points shown in summary screens.",
        itemLabel: "Point",
        addLabel: "Add Point",
        items: Array.isArray(form.summaryPoints) ? form.summaryPoints : [],
        add: formActions.addSummaryPoint,
        remove: formActions.removeSummaryPoint,
        update: formActions.updateSummaryPoint,
        placeholder: "I know the next action to take",
      }),
    );
  }

  if (form.screenType === "scenario") {
    configs.push(
      createStructuredEditor({
        title: "Scenario Options",
        description: "Decision paths learners can choose from.",
        itemLabel: "Option",
        addLabel: "Add Option",
        items: Array.isArray(form.scenarioOptions) ? form.scenarioOptions : [],
        add: formActions.addScenarioOption,
        remove: formActions.removeScenarioOption,
        update: formActions.updateScenarioOption,
        fields: [
          { key: "title", label: "Option Title", placeholder: "Response Path 1" },
          { key: "detail", label: "Outcome or Detail", placeholder: "What this choice represents" },
        ],
      }),
    );
  }

  if (form.screenType === "reflection") {
    configs.push(
      createTextEditor({
        title: "Reflection Checks",
        description: "Optional prompts that anchor the reflection screen.",
        itemLabel: "Check",
        addLabel: "Add Check",
        items: Array.isArray(form.reflectionChecks) ? form.reflectionChecks : [],
        add: formActions.addReflectionCheck,
        remove: formActions.removeReflectionCheck,
        update: formActions.updateReflectionCheck,
        placeholder: "I can explain this concept in my own words.",
      }),
    );
  }

  if (form.screenType === "quiz") {
    configs.push(
      createTextEditor({
        title: "Answer Options",
        description: "Possible learner answers for the knowledge check.",
        itemLabel: "Answer",
        addLabel: "Add Answer",
        items: Array.isArray(form.quizOptions) ? form.quizOptions : [],
        add: formActions.addQuizOption,
        remove: formActions.removeQuizOption,
        update: formActions.updateQuizOption,
        placeholder: "Option 1",
      }),
    );
  }

  if (form.screenType === "tabs" || (form.screenType === "interaction" && form.layout === "tabs-interaction")) {
    configs.push(
      createStructuredEditor({
        title: "Tabs",
        description: "Labels and content revealed when each tab is selected.",
        itemLabel: "Tab",
        addLabel: "Add Tab",
        items: Array.isArray(form.tabsItems) ? form.tabsItems : [],
        add: formActions.addTabItem,
        remove: formActions.removeTabItem,
        update: formActions.updateTabItem,
        fields: [
          { key: "title", label: "Tab Label", placeholder: "Overview" },
          { key: "content", label: "Tab Content", placeholder: "What appears when this tab is active" },
        ],
      }),
    );
  }

  if (form.screenType === "accordionInteraction" || (form.screenType === "interaction" && form.layout === "accordion")) {
    configs.push(
      createStructuredEditor({
        title: "Accordion Sections",
        description: "Expandable sections and their revealed content.",
        itemLabel: "Section",
        addLabel: "Add Section",
        items: Array.isArray(form.accordionSections) ? form.accordionSections : [],
        add: formActions.addAccordionSection,
        remove: formActions.removeAccordionSection,
        update: formActions.updateAccordionSection,
        fields: [
          { key: "title", label: "Section Title", placeholder: "Section 1" },
          { key: "content", label: "Section Content", placeholder: "What learners see when this panel expands" },
        ],
      }),
    );
  }

  if (form.screenType === "process" || (form.screenType === "interaction" && form.layout === "process-steps")) {
    configs.push(
      createStructuredEditor({
        title: "Process Steps",
        description: "Sequential stages and their descriptions.",
        itemLabel: "Step",
        addLabel: "Add Step",
        items: Array.isArray(form.processSteps) ? form.processSteps : [],
        add: formActions.addProcessStep,
        remove: formActions.removeProcessStep,
        update: formActions.updateProcessStep,
        fields: [
          { key: "title", label: "Step Title", placeholder: "Receive Request" },
          { key: "description", label: "Step Description", placeholder: "Describe what happens at this step" },
        ],
      }),
    );
  }

  if (form.screenType === "interaction" && form.layout === "click-reveal") {
    configs.push(
      createStructuredEditor({
        title: "Hotspots",
        description: "Clickable hotspots and the information each reveals.",
        itemLabel: "Hotspot",
        addLabel: "Add Hotspot",
        items: Array.isArray(form.hotspotItems) ? form.hotspotItems : [],
        add: formActions.addHotspotItem,
        remove: formActions.removeHotspotItem,
        update: formActions.updateHotspotItem,
        fields: [
          { key: "title", label: "Hotspot Label", placeholder: "Hotspot 1" },
          { key: "content", label: "Reveal Content", placeholder: "What appears after the learner clicks this hotspot" },
        ],
      }),
    );
  }

  return configs;
}

export function getSlideLayoutLabel(slide, layoutOptionsMap) {
  const options = layoutOptionsMap?.[slide.screenType] || [];
  return options.find((option) => option.value === slide.layout)?.label || slide.layout;
}
