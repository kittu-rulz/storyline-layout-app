import { getResolvedSlideSize } from "@/components/storyline/slideSize";
import { layoutOptions } from "@/data/layoutOptions";
import { screenTypes } from "@/data/screenTypes";
import { themes } from "@/data/themes";

function normalizeInteractionLayout(layout) {
  return layout === "grid-hotspots" ? "click-reveal" : layout;
}

function toSafeMargin(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeTextItems(items, label) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const text = typeof item?.text === "string" ? item.text.trim() : "";
      return text.length > 0 ? text : `${label} ${index + 1}`;
    })
    .filter(Boolean);
}

function getDynamicContentItems(form) {
  switch (form.screenType) {
    case "title":
      return normalizeTextItems(form.titleHighlights, "Highlight");
    case "content":
      return (Array.isArray(form.contentBlocks) ? form.contentBlocks : []).map(
        (item, index) => {
          const title = item?.title?.trim() || `Block ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        },
      );
    case "objectives":
      return normalizeTextItems(form.objectivesItems, "Objective");
    case "process":
      return (Array.isArray(form.processSteps) ? form.processSteps : []).map(
        (item, index) => {
          const title = item?.title?.trim() || `Step ${index + 1}`;
          const description = item?.description?.trim() || "Description pending";
          return `${title}: ${description}`;
        },
      );
    case "comparison":
      return (Array.isArray(form.comparisonRows) ? form.comparisonRows : []).map(
        (item, index) => {
          const criterion = item?.criterion?.trim() || `Criteria ${index + 1}`;
          const left = item?.left?.trim() || "Option A pending";
          const right = item?.right?.trim() || "Option B pending";
          return `${criterion} | A: ${left} | B: ${right}`;
        },
      );
    case "timeline":
      return (Array.isArray(form.timelineEvents) ? form.timelineEvents : []).map(
        (item, index) => {
          const title = item?.title?.trim() || `Event ${index + 1}`;
          const detail = item?.detail?.trim() || "Event detail pending";
          return `${title}: ${detail}`;
        },
      );
    case "summary":
      return normalizeTextItems(form.summaryPoints, "Point");
    case "tabs":
      return (Array.isArray(form.tabsItems) ? form.tabsItems : []).map(
        (item, index) => {
          const title = item?.title?.trim() || `Tab ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        },
      );
    case "scenario":
      return (Array.isArray(form.scenarioOptions) ? form.scenarioOptions : []).map(
        (item, index) => {
          const title = item?.title?.trim() || `Response Path ${index + 1}`;
          const detail = item?.detail?.trim() || "Option detail pending";
          return `${title}: ${detail}`;
        },
      );
    case "reflection":
      return normalizeTextItems(form.reflectionChecks, "Check");
    case "accordionInteraction":
      return (Array.isArray(form.accordionSections) ? form.accordionSections : []).map(
        (item, index) => {
          const title = item?.title?.trim() || `Section ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        },
      );
    case "quiz":
      return normalizeTextItems(form.quizOptions, "Option");
    case "interaction": {
      const normalizedLayout = normalizeInteractionLayout(form.layout);
      if (normalizedLayout === "tabs-interaction") {
        return (Array.isArray(form.tabsItems) ? form.tabsItems : []).map(
          (item, index) => {
            const title = item?.title?.trim() || `Tab ${index + 1}`;
            const content = item?.content?.trim() || "Content pending";
            return `${title}: ${content}`;
          },
        );
      }
      if (normalizedLayout === "process-steps") {
        return (Array.isArray(form.processSteps) ? form.processSteps : []).map(
          (item, index) => {
            const title = item?.title?.trim() || `Step ${index + 1}`;
            const description = item?.description?.trim() || "Description pending";
            return `${title}: ${description}`;
          },
        );
      }
      if (normalizedLayout === "accordion") {
        return (Array.isArray(form.accordionSections) ? form.accordionSections : []).map(
          (item, index) => {
            const title = item?.title?.trim() || `Section ${index + 1}`;
            const content = item?.content?.trim() || "Content pending";
            return `${title}: ${content}`;
          },
        );
      }

      return (Array.isArray(form.hotspotItems) ? form.hotspotItems : []).map(
        (item, index) => {
          const title = item?.title?.trim() || `Hotspot ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        },
      );
    }
    default:
      return [];
  }
}

function getInteractionPatternSpec(layout) {
  const normalizedLayout = normalizeInteractionLayout(layout);

  const specs = {
    "click-reveal": {
      structure:
        "Hotspot-based click-and-reveal layout with a dedicated detail panel",
      zones: [
        "Header",
        "Hotspot trigger area",
        "Detail reveal panel",
        "Navigation controls",
      ],
      interactionStructure: [
        "Each hotspot uses Normal, Hover, and Selected states.",
        "Selected hotspot updates a shared detail panel with matching content.",
        "Optional visited-state logic marks explored hotspots.",
        "CTA becomes active after required hotspots are viewed.",
      ],
      objectList: [
        "Slide title text box",
        "Instructional body text",
        "4 hotspot buttons (states: normal/hover/selected/visited)",
        "Detail panel container",
        "Detail title and detail body text placeholders",
        "Primary CTA button",
      ],
      suggestedAnimationNotes: [
        "Fade in hotspot row on timeline start (0.2-0.4s stagger).",
        "Use subtle fade/slide for detail panel content swap.",
        "Pulse hotspot hover state with short emphasis (<=0.2s).",
      ],
    },
    "tabs-interaction": {
      structure:
        "Tabbed interaction with selectable categories and a content panel",
      zones: [
        "Header",
        "Tab navigation row",
        "Active tab content panel",
        "Navigation controls",
      ],
      interactionStructure: [
        "Each tab updates a single shared content panel.",
        "Tab selected state persists while active.",
        "Optional visited variable tracks completed tabs.",
        "CTA can unlock after all required tabs are visited.",
      ],
      objectList: [
        "Slide title text box",
        "Instructional body text",
        "Tab button group",
        "Shared tab content container",
        "Tab heading and tab body text placeholders",
        "Primary CTA button",
      ],
      suggestedAnimationNotes: [
        "Fade in tab row and content panel on load.",
        "Use quick dissolve between tab content states.",
        "Keep transitions under 0.3s for responsiveness.",
      ],
    },
    "process-steps": {
      structure:
        "Step-based interaction with sequenced stages and selected step detail",
      zones: [
        "Header",
        "Step sequence row",
        "Selected step detail area",
        "Navigation controls",
      ],
      interactionStructure: [
        "Learner selects numbered process steps in any order.",
        "Step selected state updates detail panel content.",
        "Optional progression variable enforces linear completion.",
        "CTA can activate once required steps are reviewed.",
      ],
      objectList: [
        "Slide title text box",
        "Instructional body text",
        "Step buttons/cards (4+ with active states)",
        "Step detail panel container",
        "Step detail heading and body placeholders",
        "Primary CTA button",
      ],
      suggestedAnimationNotes: [
        "Stagger in step cards from left to right on load.",
        "Use highlight pulse when a step becomes active.",
        "Reveal detail panel content with short wipe/fade.",
      ],
    },
    accordion: {
      structure:
        "Accordion interaction with expandable sections for progressive disclosure",
      zones: [
        "Header",
        "Accordion headers",
        "Expanded content panel",
        "Navigation controls",
      ],
      interactionStructure: [
        "One accordion item expands at a time.",
        "Header selected state indicates active section.",
        "Expanded panel swaps to matching section content.",
        "Optional visited-state variable tracks opened sections.",
      ],
      objectList: [
        "Slide title text box",
        "Instructional body text",
        "Accordion header buttons (3-5)",
        "Expandable content area",
        "Section heading and body text placeholders",
        "Primary CTA button",
      ],
      suggestedAnimationNotes: [
        "Use vertical expand/collapse at 0.2-0.3s.",
        "Animate accordion chevron rotation for state clarity.",
        "Avoid heavy motion; prioritize readability.",
      ],
    },
  };

  return specs[normalizedLayout] || specs["click-reveal"];
}

function getBaseSpec(screenType) {
  const specs = {
    title: {
      structure:
        "Centered hero layout with title, subtitle, supporting shape, and CTA button",
      zones: ["Top progress marker", "Center headline", "Subhead", "Primary CTA"],
      objectList: [
        "Top accent/progress bar",
        "Main title text box",
        "Supporting body text box",
        "Primary CTA button",
        "Background shape or hero graphic placeholder",
      ],
      interactionStructure: [
        "Timeline-based entrance only; no learner interaction required.",
        "CTA advances to next slide.",
      ],
      suggestedAnimationNotes: [
        "Fade in title and body with 0.2s stagger.",
        "Optional gentle accent bar wipe on slide start.",
      ],
    },
    content: {
      structure:
        "Flexible content layout with configurable media and text placement for Storyline screens",
      zones: [
        "Header",
        "Primary content area",
        "Visual/content support area",
        "Footer navigation",
      ],
      objectList: [
        "Slide title text box",
        "Body content text box",
        "Media/illustration placeholder",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Primarily read-and-continue pattern.",
        "CTA advances learner to next screen.",
      ],
      suggestedAnimationNotes: [
        "Fade in title/body together.",
        "Optional media placeholder wipe/fade.",
      ],
    },
    objectives: {
      structure:
        "Goal-focused screen that introduces learning outcomes before main content",
      zones: [
        "Header title",
        "Objectives list/grouped outcomes",
        "Supportive context text",
        "Primary CTA",
      ],
      objectList: [
        "Slide title text box",
        "Objective list items (3-5)",
        "Supportive context/body text",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Linear read-and-continue interaction.",
        "Optional checklist states if objectives must be acknowledged.",
      ],
      suggestedAnimationNotes: [
        "Stagger objective bullets on entry.",
        "Keep objective motion subtle for clarity.",
      ],
    },
    process: {
      structure:
        "Step-based layout that communicates sequential workflow or procedure logic",
      zones: ["Header", "Step sequence", "Step details", "Navigation/CTA"],
      objectList: [
        "Slide title text box",
        "Step sequence cards or timeline nodes",
        "Step detail text block",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Can be static sequence or click-to-reveal steps.",
        "If interactive, visited state tracks reviewed steps.",
      ],
      suggestedAnimationNotes: [
        "Reveal steps in sequence on load.",
        "Use emphasis animation on current step.",
      ],
    },
    comparison: {
      structure:
        "Side-by-side comparison layout for contrasting options, features, or outcomes",
      zones: ["Header", "Comparison criteria", "Option A panel", "Option B panel"],
      objectList: [
        "Slide title text box",
        "Body/instructional text box",
        "Comparison criteria labels",
        "Option A content panel",
        "Option B content panel",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Primarily review-and-decide pattern.",
        "Optional highlights to emphasize key differences.",
      ],
      suggestedAnimationNotes: [
        "Stagger option panels from left/right on entry.",
        "Use subtle emphasis pulse on selected criterion row.",
      ],
    },
    timeline: {
      structure:
        "Chronological timeline layout to communicate sequence, milestones, or events",
      zones: ["Header", "Timeline rail", "Milestone/event cards", "Navigation/CTA"],
      objectList: [
        "Slide title text box",
        "Body/instructional text box",
        "Timeline connector/rail",
        "Milestone markers (3-6)",
        "Milestone description text",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Can be static overview or click-to-reveal milestones.",
        "Optional visited state tracks viewed milestones.",
      ],
      suggestedAnimationNotes: [
        "Animate timeline rail draw on slide start.",
        "Stagger milestone card reveals in chronological order.",
      ],
    },
    summary: {
      structure:
        "Recap screen to reinforce core points and transition learners forward",
      zones: [
        "Summary heading",
        "Key takeaways/checklist",
        "Optional reflection prompt",
        "Next action",
      ],
      objectList: [
        "Slide title text box",
        "Takeaway list/checklist items",
        "Optional reflection prompt text",
        "Next action CTA button",
      ],
      interactionStructure: [
        "Linear review screen.",
        "Optional click-to-check completion states.",
      ],
      suggestedAnimationNotes: [
        "Stagger takeaway lines for readability.",
        "Use subtle CTA emphasis near timeline end.",
      ],
    },
    tabs: {
      structure:
        "Tabbed interaction frame with selectable categories and a content reveal panel",
      zones: ["Header", "Tab navigation row", "Active tab content panel", "CTA"],
      objectList: [
        "Slide title text box",
        "Tab button group",
        "Shared content panel",
        "Tab-specific heading and body placeholders",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Tab buttons switch a single content panel.",
        "Visited tabs can be tracked for completion.",
      ],
      suggestedAnimationNotes: [
        "Quick dissolve between tab states.",
        "Keep tab state transitions under 0.3s.",
      ],
    },
    scenario: {
      structure:
        "Scenario-based decision layout with learner choices and consequence feedback",
      zones: ["Header", "Scenario context", "Decision options", "Feedback/next action"],
      objectList: [
        "Slide title text box",
        "Scenario context text panel",
        "Decision option buttons/cards",
        "Consequence/feedback content area",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Learner selects a response path from available options.",
        "Selection reveals aligned consequence or coaching feedback.",
        "Optional retry path allows reconsideration before continue.",
      ],
      suggestedAnimationNotes: [
        "Stagger decision options on entry for readability.",
        "Reveal feedback panel with short fade/slide transition.",
      ],
    },
    reflection: {
      structure:
        "Reflection prompt layout with guided response area and optional self-check cues",
      zones: ["Header", "Reflection prompt", "Response area", "Navigation/CTA"],
      objectList: [
        "Slide title text box",
        "Reflection prompt text block",
        "Response text-entry placeholder",
        "Optional self-check checklist",
        "Primary CTA button",
      ],
      interactionStructure: [
        "Learner reads prompt and records a short response.",
        "Optional checklist can reinforce commitment before continue.",
      ],
      suggestedAnimationNotes: [
        "Use subtle prompt fade-in and avoid heavy motion.",
        "Emphasize response area with gentle highlight on load.",
      ],
    },
    accordionInteraction: {
      structure:
        "Accordion interaction with expandable sections for progressive disclosure",
      zones: [
        "Header",
        "Accordion section headers",
        "Expanded content panel",
        "Navigation/CTA",
      ],
      objectList: [
        "Slide title text box",
        "Instructional body text",
        "Accordion section buttons (3-5)",
        "Expanded section content container",
        "Section heading and body placeholders",
        "Primary CTA button",
      ],
      interactionStructure: [
        "One accordion section expands at a time.",
        "Selected section state controls visible content.",
        "Optional completion variable tracks opened sections.",
      ],
      suggestedAnimationNotes: [
        "Use concise expand/collapse animation (0.2-0.3s).",
        "Animate chevron/icon rotation for state clarity.",
      ],
    },
    quiz: {
      structure: "Question block with four answer options and submit button",
      zones: ["Question area", "Answer list", "Feedback area", "Submit control"],
      objectList: [
        "Question text box",
        "Answer option buttons/radio controls",
        "Submit button",
        "Feedback layer placeholders (correct/incorrect)",
      ],
      interactionStructure: [
        "Learner selects answer option and submits.",
        "Feedback layer appears based on selected answer.",
      ],
      suggestedAnimationNotes: [
        "Minimal motion; prioritize assessment clarity.",
        "Use immediate feedback layer transition on submit.",
      ],
    },
  };

  return specs[screenType] || specs.content;
}

export function generateSpec(form) {
  const { screenType, title, body, cta, theme, layout, notes } = form;
  const { label: slideSize } = getResolvedSlideSize(form);
  const selectedLayout =
    layoutOptions[screenType]?.find((item) => item.value === layout)?.label ||
    layout;

  const productionNotes = notes?.trim() || "";
  const dynamicContentItems = getDynamicContentItems(form);
  const safeMargins = {
    top: toSafeMargin(form.safeMargins?.top, 120),
    bottom: toSafeMargin(form.safeMargins?.bottom, 140),
    left: toSafeMargin(form.safeMargins?.left, 120),
    right: toSafeMargin(form.safeMargins?.right, 120),
  };

  const baseSpec = getBaseSpec(screenType);
  const interactionSpec =
    screenType === "interaction"
      ? getInteractionPatternSpec(layout)
      : {
          structure: baseSpec.structure,
          zones: baseSpec.zones,
          objectList: baseSpec.objectList,
          interactionStructure: baseSpec.interactionStructure,
          suggestedAnimationNotes: baseSpec.suggestedAnimationNotes,
        };

  return {
    screenTypeKey: screenType,
    screenType: screenTypes[screenType].name,
    layoutStyle: selectedLayout,
    theme: themes[theme].name,
    slideSize,
    content: {
      title,
      body,
      cta,
      dynamicItems: dynamicContentItems,
    },
    structure: interactionSpec.structure,
    zones: interactionSpec.zones,
    objectList: interactionSpec.objectList,
    interactionStructure: interactionSpec.interactionStructure,
    suggestedAnimationNotes: interactionSpec.suggestedAnimationNotes,
    safeMargins,
    designerNotes: productionNotes,
  };
}
