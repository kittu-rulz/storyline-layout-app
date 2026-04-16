import { screenTypes } from "@/data/screenTypes";
import { accordion01Template } from "@/features/storyboard/templates/accordion-01";
import { agenda01Template } from "@/features/storyboard/templates/agenda-01";
import { cards01Template } from "@/features/storyboard/templates/cards-01";
import { clickReveal01Template } from "@/features/storyboard/templates/click-reveal-01";
import { comparison01Template } from "@/features/storyboard/templates/comparison-01";
import { contentImage01Template } from "@/features/storyboard/templates/content-image-01";
import { objectives01Template } from "@/features/storyboard/templates/objectives-01";
import { process01Template } from "@/features/storyboard/templates/process-01";
import { quizMcq01Template } from "@/features/storyboard/templates/quiz-mcq-01";
import { scenarioDecision01Template } from "@/features/storyboard/templates/scenario-decision-01";
import { tabs01Template } from "@/features/storyboard/templates/tabs-01";
import { timeline01Template } from "@/features/storyboard/templates/timeline-01";
import { title01Template } from "@/features/storyboard/templates/title-01";

export const STORYBOARD_TEMPLATES = [
  title01Template,
  objectives01Template,
  agenda01Template,
  contentImage01Template,
  cards01Template,
  comparison01Template,
  tabs01Template,
  accordion01Template,
  clickReveal01Template,
  process01Template,
  timeline01Template,
  scenarioDecision01Template,
  quizMcq01Template,
];

const TEMPLATE_BY_ID = STORYBOARD_TEMPLATES.reduce((map, template) => {
  if (map.has(template.id)) {
    throw new Error(`Duplicate storyboard template id detected: ${template.id}`);
  }

  map.set(template.id, template);
  return map;
}, new Map());

const SCREEN_TYPE_FALLBACKS = {
  title: "title-01",
  objectives: "objectives-01",
  summary: "title-01",
  reflection: "title-01",
  content: "content-image-01",
  comparison: "comparison-01",
  timeline: "timeline-01",
  quiz: "quiz-mcq-01",
  tabs: "tabs-01",
  accordionInteraction: "accordion-01",
  interaction: "click-reveal-01",
  process: "process-01",
  scenario: "scenario-decision-01",
};

export function getAllTemplates() {
  return STORYBOARD_TEMPLATES;
}

export function getTemplateById(templateId) {
  return TEMPLATE_BY_ID.get(templateId) ?? null;
}

export function getTemplatesByScreenType(screenType) {
  return STORYBOARD_TEMPLATES.filter((template) => template.screenType === screenType);
}

export function getTemplatesByCategory(category) {
  return STORYBOARD_TEMPLATES.filter((template) => template.category === category);
}

export function getDefaultTemplateId({ screenType, layout } = {}) {
  if (screenType && layout) {
    const exactMatch = STORYBOARD_TEMPLATES.find(
      (template) => template.screenType === screenType && template.layout === layout,
    );
    if (exactMatch) {
      return exactMatch.id;
    }
  }

  if (screenType) {
    const sameScreenType = STORYBOARD_TEMPLATES.find((template) => template.screenType === screenType);
    if (sameScreenType) {
      return sameScreenType.id;
    }
  }

  const fallbackId = SCREEN_TYPE_FALLBACKS[screenType];
  if (fallbackId) {
    return fallbackId;
  }

  const category = screenTypes[screenType]?.category;
  if (category) {
    const categoryTemplate = STORYBOARD_TEMPLATES.find((template) => template.category === category);
    if (categoryTemplate) {
      return categoryTemplate.id;
    }
  }

  return contentImage01Template.id;
}

export function resolveTemplateForSlide(slide = {}) {
  const templateId = getTemplateById(slide.templateId)
    ? slide.templateId
    : getDefaultTemplateId({ screenType: slide.screenType, layout: slide.layout });

  return getTemplateById(templateId);
}
