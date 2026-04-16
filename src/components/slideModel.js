import { layoutOptions } from "@/data/layoutOptions";
import {
  CUSTOM_SLIDE_SIZE_PRESET,
  DEFAULT_SLIDE_SIZE_PRESET,
  slideSizePresets,
} from "@/data/slideSizes";
import {
  DEFAULT_SAFE_AREA_PRESET,
  safeAreaPresets,
} from "@/data/safeAreaPresets";
import { screenTypes } from "@/data/screenTypes";
import { themes } from "@/data/themes";
import {
  getSlideSizePreset,
  sanitizeCustomSlideSizeValue,
} from "@/components/storyline/slideSize";
import {
  getDefaultTemplateId,
  getTemplateById,
} from "@/features/storyboard/templates";

export const DEFAULT_SCREEN_TYPE = "content";
export const FALLBACK_SCREEN_TYPE = "content";
export const STORYBOARD_SCHEMA_VERSION = 1;
export const DEFAULT_SAFE_MARGINS = {
  top: 120,
  bottom: 140,
  left: 120,
  right: 120,
};

const DEFAULT_TITLE_HIGHLIGHTS = [
  { text: "What you will learn" },
  { text: "Why it matters" },
  { text: "How to apply it" },
];
const DEFAULT_CONTENT_BLOCKS = [
  {
    title: "Core Insight",
    content: "Use this block for your primary explanation or key concept.",
  },
  {
    title: "Supporting Detail",
    content: "Use this block for examples, process notes, or implementation guidance.",
  },
];
const DEFAULT_OBJECTIVE_ITEMS = [
  { text: "Define the core concept in plain language." },
  { text: "Identify common errors and prevention steps." },
  { text: "Apply the concept in a practical scenario." },
  { text: "Evaluate outcomes and improve next actions." },
];
const DEFAULT_COMPARISON_ROWS = [
  { criterion: "Speed", left: "Faster rollout", right: "Moderate rollout" },
  { criterion: "Complexity", left: "Lower complexity", right: "Higher complexity" },
  { criterion: "Best Use", left: "Quick wins", right: "Deep capability" },
];
const DEFAULT_TIMELINE_EVENTS = [
  { title: "Kickoff", detail: "Define scope, stakeholders, and delivery milestones." },
  { title: "Design", detail: "Create the content and interaction blueprint." },
  { title: "Build", detail: "Develop Storyline slides, states, and triggers." },
  { title: "Launch", detail: "Deploy, validate tracking, and monitor outcomes." },
];
const DEFAULT_SUMMARY_POINTS = [
  { text: "I can explain the core concept in simple terms." },
  { text: "I understand the key steps in the process." },
  { text: "I can apply this in a practical context." },
  { text: "I know the next action to take." },
];
const DEFAULT_SCENARIO_OPTIONS = [
  { title: "Response Path 1", detail: "Acknowledge concern and ask a clarifying question." },
  { title: "Response Path 2", detail: "Offer a direct recommendation based on known constraints." },
  { title: "Response Path 3", detail: "Escalate to a specialist with context summary." },
  { title: "Response Path 4", detail: "Document next steps and confirm follow-up timing." },
];
const DEFAULT_REFLECTION_CHECKS = [
  { text: "I can explain this concept in my own words." },
  { text: "I know where to apply it in my workflow." },
  { text: "I can identify one concrete next action." },
];
const DEFAULT_QUIZ_OPTIONS = [
  { text: "Option 1" },
  { text: "Option 2" },
  { text: "Option 3" },
  { text: "Option 4" },
];
const DEFAULT_HOTSPOT_ITEMS = [
  { title: "Hotspot 1", content: "Explain the first interface area and its function." },
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
];
const DEFAULT_TAB_ITEMS = [
  {
    title: "Overview",
    content: "Introduce the first concept with a concise explanation.",
  },
  {
    title: "Details",
    content: "Add supporting details, examples, or key definitions.",
  },
  {
    title: "Examples",
    content: "Show practical examples learners can connect to.",
  },
];
const DEFAULT_ACCORDION_SECTIONS = [
  {
    title: "Section 1",
    content: "Primary section content for the first accordion panel.",
  },
  {
    title: "Section 2",
    content: "Secondary section content for the next accordion panel.",
  },
  {
    title: "Section 3",
    content: "Additional details for the final accordion panel.",
  },
];
const DEFAULT_PROCESS_STEPS = [
  {
    title: "Step 1",
    description: "Describe the first step and expected outcome.",
  },
  {
    title: "Step 2",
    description: "Describe the second step and transition.",
  },
  {
    title: "Step 3",
    description: "Describe the third step and completion criteria.",
  },
];

const defaultSlidePreset = getSlideSizePreset(DEFAULT_SLIDE_SIZE_PRESET);

function createTextItemCloner(fallbackItems, label) {
  return (items = fallbackItems) => {
    if (!Array.isArray(items) || items.length === 0) {
      return fallbackItems.map((item) => ({ ...item }));
    }

    return items.map((item, index) => ({
      text:
        typeof item?.text === "string" && item.text.length > 0
          ? item.text
          : `${label} ${index + 1}`,
    }));
  };
}

function createStructuredItemCloner(fallbackItems, fields, labels) {
  return (items = fallbackItems) => {
    if (!Array.isArray(items) || items.length === 0) {
      return fallbackItems.map((item) => ({ ...item }));
    }

    return items.map((item, index) =>
      fields.reduce((nextItem, field) => {
        const value = item?.[field];
        const fallbackLabel = labels[field];
        nextItem[field] =
          typeof value === "string" && value.length > 0
            ? value
            : fallbackLabel
              ? `${fallbackLabel} ${index + 1}`
              : typeof value === "string"
                ? value
                : "";
        return nextItem;
      }, {}),
    );
  };
}

const COLLECTION_CLONERS = {
  titleHighlights: createTextItemCloner(DEFAULT_TITLE_HIGHLIGHTS, "Highlight"),
  contentBlocks: createStructuredItemCloner(
    DEFAULT_CONTENT_BLOCKS,
    ["title", "content"],
    { title: "Block" },
  ),
  objectivesItems: createTextItemCloner(DEFAULT_OBJECTIVE_ITEMS, "Objective"),
  comparisonRows: createStructuredItemCloner(
    DEFAULT_COMPARISON_ROWS,
    ["criterion", "left", "right"],
    { criterion: "Criteria" },
  ),
  timelineEvents: createStructuredItemCloner(
    DEFAULT_TIMELINE_EVENTS,
    ["title", "detail"],
    { title: "Event" },
  ),
  summaryPoints: createTextItemCloner(DEFAULT_SUMMARY_POINTS, "Point"),
  scenarioOptions: createStructuredItemCloner(
    DEFAULT_SCENARIO_OPTIONS,
    ["title", "detail"],
    { title: "Response Path" },
  ),
  reflectionChecks: createTextItemCloner(DEFAULT_REFLECTION_CHECKS, "Check"),
  quizOptions: createTextItemCloner(DEFAULT_QUIZ_OPTIONS, "Option"),
  hotspotItems: createStructuredItemCloner(
    DEFAULT_HOTSPOT_ITEMS,
    ["title", "content"],
    { title: "Hotspot" },
  ),
  tabsItems: createStructuredItemCloner(
    DEFAULT_TAB_ITEMS,
    ["title", "content"],
    { title: "Tab" },
  ),
  accordionSections: createStructuredItemCloner(
    DEFAULT_ACCORDION_SECTIONS,
    ["title", "content"],
    { title: "Section" },
  ),
  processSteps: createStructuredItemCloner(
    DEFAULT_PROCESS_STEPS,
    ["title", "description"],
    { title: "Step" },
  ),
};

export const DYNAMIC_COLLECTION_FIELDS = Object.keys(COLLECTION_CLONERS);

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNonNegativeInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeInteractionLayout(layout) {
  return layout === "grid-hotspots" ? "click-reveal" : layout;
}

function hasMeaningfulValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function cloneTemplateValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === "object" ? { ...item } : item));
  }

  if (value && typeof value === "object") {
    return { ...value };
  }

  return value;
}

function getTemplateFieldDefaults(template) {
  const defaults = { ...(template?.defaultContent ?? {}) };

  for (const section of template?.formSchema?.sections ?? []) {
    for (const field of section.fields ?? []) {
      if (field.defaultValue !== undefined && defaults[field.id] === undefined) {
        defaults[field.id] = cloneTemplateValue(field.defaultValue);
      }
    }
  }

  return defaults;
}

function shouldApplyTemplateDefault(currentValue, defaultValue) {
  if (Array.isArray(defaultValue)) {
    return !Array.isArray(currentValue) || currentValue.length === 0;
  }

  if (typeof defaultValue === "string") {
    return !hasMeaningfulValue(currentValue);
  }

  if (typeof defaultValue === "boolean") {
    return typeof currentValue !== "boolean";
  }

  if (defaultValue && typeof defaultValue === "object") {
    return !currentValue || typeof currentValue !== "object";
  }

  return currentValue === undefined || currentValue === null;
}

function resolveTemplateId(screenType, layout, templateId) {
  return getTemplateById(templateId)
    ? templateId
    : getDefaultTemplateId({ screenType, layout });
}

export function validateSlideForExport(slide) {
  const issues = [];

  if (!hasMeaningfulValue(slide?.title)) {
    issues.push("Title is required.");
  }

  if (!hasMeaningfulValue(slide?.body)) {
    issues.push("Body copy is required.");
  }

  if (!hasMeaningfulValue(slide?.cta)) {
    issues.push("CTA label is required.");
  }

  const width = Number(slide?.customSlideSize?.width);
  const height = Number(slide?.customSlideSize?.height);

  if (slide?.slideSizePreset === CUSTOM_SLIDE_SIZE_PRESET) {
    if (!Number.isFinite(width) || width <= 0) {
      issues.push("Custom slide width must be a positive number.");
    }

    if (!Number.isFinite(height) || height <= 0) {
      issues.push("Custom slide height must be a positive number.");
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function cloneDynamicCollection(field, items) {
  const cloner = COLLECTION_CLONERS[field];
  return cloner ? cloner(items) : [];
}

export function buildDynamicCollectionDefaults(defaults = {}) {
  return DYNAMIC_COLLECTION_FIELDS.reduce((collections, field) => {
    collections[field] = cloneDynamicCollection(field, defaults[field]);
    return collections;
  }, {});
}

function mergeDynamicCollectionState(currentState = {}, defaults = {}) {
  return DYNAMIC_COLLECTION_FIELDS.reduce((collections, field) => {
    const currentItems = currentState[field];
    collections[field] =
      Array.isArray(currentItems) && currentItems.length > 0
        ? cloneDynamicCollection(field, currentItems)
        : cloneDynamicCollection(field, defaults[field]);
    return collections;
  }, {});
}

export function getScreenDefaults(screenType) {
  const defaults = screenTypes[screenType]?.defaults;
  if (!defaults) {
    return screenTypes[DEFAULT_SCREEN_TYPE].defaults;
  }
  return defaults;
}

export function getAllowedLayouts(screenType) {
  return (layoutOptions[screenType] || []).map((option) => option.value);
}

export function getValidLayoutForScreen(screenType, layout) {
  const normalizedLayout = normalizeInteractionLayout(layout);
  const defaults = getScreenDefaults(screenType);
  return getAllowedLayouts(screenType).includes(normalizedLayout)
    ? normalizedLayout
    : defaults.layout;
}

const BASE_FORM_STATE = {
  theme: "corporate",
  slideSizePreset: DEFAULT_SLIDE_SIZE_PRESET,
  customSlideSize: {
    width: defaultSlidePreset.width,
    height: defaultSlidePreset.height,
  },
  showSafeGrid: false,
  showGridLabels: false,
  showRulers: false,
  showPixelGrid: false,
  notes: "",
  safeAreaPreset: DEFAULT_SAFE_AREA_PRESET,
  safeMargins: { ...DEFAULT_SAFE_MARGINS },
  ...buildDynamicCollectionDefaults(),
};

export function createInitialFormState(screenType = DEFAULT_SCREEN_TYPE) {
  const defaults = getScreenDefaults(screenType);

  return {
    ...BASE_FORM_STATE,
    customSlideSize: { ...BASE_FORM_STATE.customSlideSize },
    safeMargins: { ...BASE_FORM_STATE.safeMargins },
    ...buildDynamicCollectionDefaults(defaults),
    screenType,
    templateId: getDefaultTemplateId({
      screenType,
      layout: defaults.layout,
    }),
    title: defaults.title,
    body: defaults.body,
    cta: defaults.cta,
    layout: defaults.layout,
  };
}

export function changeScreenTypePreservingContent(prev, screenType) {
  const defaults = getScreenDefaults(screenType);

  const layout = getValidLayoutForScreen(screenType, prev.layout);

  return {
    ...prev,
    ...mergeDynamicCollectionState(prev, defaults),
    screenType,
    templateId: resolveTemplateId(screenType, layout, prev.templateId),
    title: hasMeaningfulValue(prev.title) ? prev.title : defaults.title,
    body: hasMeaningfulValue(prev.body) ? prev.body : defaults.body,
    cta: hasMeaningfulValue(prev.cta) ? prev.cta : defaults.cta,
    layout,
  };
}

export function applyTemplatePreservingContent(prev, templateId) {
  const template = getTemplateById(templateId);
  if (!template) {
    return prev;
  }

  const next = changeScreenTypePreservingContent(prev, template.screenType);
  const nextLayout = getValidLayoutForScreen(template.screenType, template.layout);
  const nextState = {
    ...next,
    layout: nextLayout,
    templateId: template.id,
  };

  const templateDefaults = getTemplateFieldDefaults(template);

  return Object.entries(templateDefaults).reduce((acc, [fieldId, defaultValue]) => {
    if (shouldApplyTemplateDefault(acc[fieldId], defaultValue)) {
      acc[fieldId] = cloneTemplateValue(defaultValue);
    }

    return acc;
  }, nextState);
}

export function createSlideId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createStoryboardSlide(screenType = DEFAULT_SCREEN_TYPE) {
  return {
    id: createSlideId(),
    ...createInitialFormState(screenType),
  };
}

export function cloneSlideForDuplicate(slide) {
  return {
    ...slide,
    id: createSlideId(),
    customSlideSize: {
      width: sanitizeCustomSlideSizeValue(
        slide.customSlideSize?.width,
        defaultSlidePreset.width,
      ),
      height: sanitizeCustomSlideSizeValue(
        slide.customSlideSize?.height,
        defaultSlidePreset.height,
      ),
    },
    safeMargins: {
      top: parseNonNegativeInteger(slide.safeMargins?.top, DEFAULT_SAFE_MARGINS.top),
      bottom: parseNonNegativeInteger(
        slide.safeMargins?.bottom,
        DEFAULT_SAFE_MARGINS.bottom,
      ),
      left: parseNonNegativeInteger(slide.safeMargins?.left, DEFAULT_SAFE_MARGINS.left),
      right: parseNonNegativeInteger(
        slide.safeMargins?.right,
        DEFAULT_SAFE_MARGINS.right,
      ),
    },
    ...buildDynamicCollectionDefaults(slide),
  };
}

export function sanitizeSavedSlide(rawSlide, options = {}) {
  const strict = options.strict === true;
  const slideNumber = options.slideNumber || 1;
  const rawScreenType =
    typeof rawSlide?.screenType === "string"
      ? rawSlide.screenType
      : FALLBACK_SCREEN_TYPE;
  const isKnownScreenType = Object.prototype.hasOwnProperty.call(
    screenTypes,
    rawScreenType,
  );

  if (strict && !isKnownScreenType) {
    throw new Error(`Slide ${slideNumber}: Unknown screen type "${rawScreenType}".`);
  }

  const screenType = isKnownScreenType ? rawScreenType : FALLBACK_SCREEN_TYPE;
  const base = createInitialFormState(screenType);
  const rawLayout =
    typeof rawSlide?.layout === "string" ? rawSlide.layout : base.layout;
  const layout = getValidLayoutForScreen(screenType, rawLayout);

  if (strict && layout !== normalizeInteractionLayout(rawLayout)) {
    throw new Error(
      `Slide ${slideNumber}: Layout "${rawLayout}" is invalid for "${screenType}".`,
    );
  }

  if (strict) {
    const missingFields = ["title", "body", "cta"].filter(
      (field) => typeof rawSlide?.[field] !== "string",
    );
    if (missingFields.length > 0) {
      throw new Error(
        `Slide ${slideNumber}: Missing required field(s): ${missingFields.join(", ")}.`,
      );
    }
  }

  const validTheme = Object.prototype.hasOwnProperty.call(themes, rawSlide?.theme)
    ? rawSlide.theme
    : base.theme;
  const validSlideSizePreset = slideSizePresets.some(
    (preset) => preset.value === rawSlide?.slideSizePreset,
  )
    ? rawSlide.slideSizePreset
    : base.slideSizePreset;
  const validSafeAreaPreset = safeAreaPresets.some(
    (preset) => preset.value === rawSlide?.safeAreaPreset,
  )
    ? rawSlide.safeAreaPreset
    : base.safeAreaPreset;
  const notes =
    typeof rawSlide?.notes === "string"
      ? rawSlide.notes
      : typeof rawSlide?.designerNotes === "string"
        ? rawSlide.designerNotes
        : base.notes;

  const mergedCollections = buildDynamicCollectionDefaults({
    titleHighlights:
      rawSlide?.titleHighlights ??
      rawSlide?.highlights ??
      rawSlide?.dynamicContent?.titleHighlights,
    contentBlocks:
      rawSlide?.contentBlocks ??
      rawSlide?.contentItems ??
      rawSlide?.dynamicContent?.contentBlocks,
    objectivesItems:
      rawSlide?.objectivesItems ??
      rawSlide?.objectives ??
      rawSlide?.dynamicContent?.objectivesItems,
    comparisonRows:
      rawSlide?.comparisonRows ??
      rawSlide?.comparison ??
      rawSlide?.dynamicContent?.comparisonRows,
    timelineEvents:
      rawSlide?.timelineEvents ??
      rawSlide?.events ??
      rawSlide?.dynamicContent?.timelineEvents,
    summaryPoints:
      rawSlide?.summaryPoints ??
      rawSlide?.takeaways ??
      rawSlide?.dynamicContent?.summaryPoints,
    scenarioOptions:
      rawSlide?.scenarioOptions ??
      rawSlide?.options ??
      rawSlide?.dynamicContent?.scenarioOptions,
    reflectionChecks:
      rawSlide?.reflectionChecks ??
      rawSlide?.checklist ??
      rawSlide?.dynamicContent?.reflectionChecks,
    quizOptions:
      rawSlide?.quizOptions ??
      rawSlide?.options ??
      rawSlide?.dynamicContent?.quizOptions,
    hotspotItems:
      rawSlide?.hotspotItems ??
      rawSlide?.hotspots ??
      rawSlide?.dynamicContent?.hotspotItems,
    tabsItems:
      rawSlide?.tabsItems ??
      rawSlide?.tabs ??
      rawSlide?.dynamicContent?.tabsItems,
    accordionSections:
      rawSlide?.accordionSections ??
      rawSlide?.sections ??
      rawSlide?.dynamicContent?.accordionSections,
    processSteps:
      rawSlide?.processSteps ??
      rawSlide?.steps ??
      rawSlide?.dynamicContent?.processSteps,
  });

  return {
    ...base,
    ...rawSlide,
    id:
      typeof rawSlide?.id === "string" && rawSlide.id.length > 0
        ? rawSlide.id
        : createSlideId(),
    ...mergedCollections,
    screenType,
    templateId: resolveTemplateId(screenType, layout, rawSlide?.templateId),
    layout,
    theme: validTheme,
    title: typeof rawSlide?.title === "string" ? rawSlide.title : base.title,
    body: typeof rawSlide?.body === "string" ? rawSlide.body : base.body,
    cta: typeof rawSlide?.cta === "string" ? rawSlide.cta : base.cta,
    slideSizePreset: validSlideSizePreset,
    customSlideSize: {
      width: parsePositiveInteger(
        rawSlide?.customSlideSize?.width,
        base.customSlideSize.width,
      ),
      height: parsePositiveInteger(
        rawSlide?.customSlideSize?.height,
        base.customSlideSize.height,
      ),
    },
    showSafeGrid:
      typeof rawSlide?.showSafeGrid === "boolean"
        ? rawSlide.showSafeGrid
        : base.showSafeGrid,
    showGridLabels:
      typeof rawSlide?.showGridLabels === "boolean"
        ? rawSlide.showGridLabels
        : base.showGridLabels,
    showRulers:
      typeof rawSlide?.showRulers === "boolean"
        ? rawSlide.showRulers
        : base.showRulers,
    showPixelGrid:
      typeof rawSlide?.showPixelGrid === "boolean"
        ? rawSlide.showPixelGrid
        : base.showPixelGrid,
    safeAreaPreset: validSafeAreaPreset,
    safeMargins: {
      top: parseNonNegativeInteger(rawSlide?.safeMargins?.top, base.safeMargins.top),
      bottom: parseNonNegativeInteger(
        rawSlide?.safeMargins?.bottom,
        base.safeMargins.bottom,
      ),
      left: parseNonNegativeInteger(rawSlide?.safeMargins?.left, base.safeMargins.left),
      right: parseNonNegativeInteger(
        rawSlide?.safeMargins?.right,
        base.safeMargins.right,
      ),
    },
    notes,
  };
}

export function parseImportedStoryboardPayload(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid JSON structure. Please upload a valid storyboard file.");
  }

  const schemaVersion = Number.parseInt(
    parsed?.schemaVersion ?? parsed?.meta?.schemaVersion,
    10,
  );

  if (Number.isFinite(schemaVersion) && schemaVersion > STORYBOARD_SCHEMA_VERSION) {
    throw new Error(
      `This storyboard file uses schema version ${schemaVersion}. Please upgrade the app before importing it.`,
    );
  }

  let rawSlides = [];
  let rawActiveSlideId = null;

  if (Array.isArray(parsed.slides)) {
    rawSlides = parsed.slides;
    rawActiveSlideId = parsed.activeSlideId;
  } else if (
    typeof parsed.screenType === "string" &&
    typeof parsed.layout === "string"
  ) {
    rawSlides = [parsed];
  } else {
    throw new Error(
      "Unsupported file format. Expected a storyboard JSON with a slides array.",
    );
  }

  if (rawSlides.length === 0) {
    throw new Error("This storyboard file has no slides.");
  }

  const seenIds = new Set();
  const slides = rawSlides.map((slide, index) => {
    if (!slide || typeof slide !== "object") {
      throw new Error(`Slide ${index + 1}: Invalid slide structure.`);
    }

    const sanitized = sanitizeSavedSlide(slide, {
      strict: true,
      slideNumber: index + 1,
    });

    if (seenIds.has(sanitized.id)) {
      sanitized.id = createSlideId();
    }
    seenIds.add(sanitized.id);
    return sanitized;
  });

  const activeSlideId =
    typeof rawActiveSlideId === "string" &&
    slides.some((slide) => slide.id === rawActiveSlideId)
      ? rawActiveSlideId
      : slides[0].id;

  return {
    slides,
    activeSlideId,
  };
}

export { CUSTOM_SLIDE_SIZE_PRESET, sanitizeCustomSlideSizeValue };


