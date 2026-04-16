import {
  applyTemplatePreservingContent,
  buildDynamicCollectionDefaults,
  changeScreenTypePreservingContent,
  createInitialFormState,
  CUSTOM_SLIDE_SIZE_PRESET,
  DEFAULT_SAFE_MARGINS,
  DEFAULT_SCREEN_TYPE,
  getScreenDefaults,
  sanitizeCustomSlideSizeValue,
} from "@/components/slideModel";
import { getDefaultTemplateId } from "@/features/storyboard/templates";
import {
  DEFAULT_SAFE_AREA_PRESET as DEFAULT_SAFE_AREA_VALUE,
  safeAreaPresets,
} from "@/data/safeAreaPresets";

const safeAreaPresetMap = Object.fromEntries(
  safeAreaPresets.map((preset) => [preset.value, preset]),
);

function cloneFieldValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === "object" ? { ...item } : item));
  }

  if (value && typeof value === "object") {
    return { ...value };
  }

  return value;
}

export { createInitialFormState };

export function createFormActions(setForm) {
  const switchScreenType = (screenType) => {
    setForm((prev) => changeScreenTypePreservingContent(prev, screenType));
  };

  const switchLayoutStyle = (layout) => {
    setForm((prev) => ({
      ...prev,
      layout,
      templateId: getDefaultTemplateId({
        screenType: prev.screenType,
        layout,
      }),
    }));
  };

  const switchSlideSizePreset = (slideSizePreset) => {
    setForm((prev) => ({
      ...prev,
      slideSizePreset,
    }));
  };

  const applyTemplate = (templateId) => {
    setForm((prev) => applyTemplatePreservingContent(prev, templateId));
  };

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateRepeaterItem = (field, index, key, value) => {
    updateArrayItem(field, index, key, value);
  };

  const addRepeaterItem = (field, item) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];

      return {
        ...prev,
        [field]: [...current, cloneFieldValue(item)],
      };
    });
  };

  const removeRepeaterItem = (field, index, minItems = 1) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      if (current.length <= minItems) {
        return prev;
      }

      return {
        ...prev,
        [field]: current.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const updateCustomSlideSize = (dimension, value) => {
    setForm((prev) => {
      const currentValue = prev.customSlideSize?.[dimension];
      const safeValue = sanitizeCustomSlideSizeValue(value, currentValue);

      return {
        ...prev,
        slideSizePreset: CUSTOM_SLIDE_SIZE_PRESET,
        customSlideSize: {
          ...prev.customSlideSize,
          [dimension]: safeValue,
        },
      };
    });
  };

  const updateSafeMargin = (side, value) => {
    const parsed = Number.parseInt(value, 10);
    const safeValue = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

    setForm((prev) => ({
      ...prev,
      safeMargins: {
        ...prev.safeMargins,
        [side]: safeValue,
      },
    }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];

      return {
        ...prev,
        [field]: current.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      };
    });
  };

  const addArrayItem = (field, factory) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];

      return {
        ...prev,
        [field]: [...current, factory(current.length)],
      };
    });
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      if (current.length <= 1) return prev;

      return {
        ...prev,
        [field]: current.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const updateTitleHighlight = (index, value) => {
    updateArrayItem("titleHighlights", index, "text", value);
  };
  const addTitleHighlight = () => {
    addArrayItem("titleHighlights", (index) => ({ text: `Highlight ${index + 1}` }));
  };
  const removeTitleHighlight = (index) => {
    removeArrayItem("titleHighlights", index);
  };

  const updateContentBlock = (index, key, value) => {
    updateArrayItem("contentBlocks", index, key, value);
  };
  const addContentBlock = () => {
    addArrayItem("contentBlocks", (index) => ({
      title: `Block ${index + 1}`,
      content: "",
    }));
  };
  const removeContentBlock = (index) => {
    removeArrayItem("contentBlocks", index);
  };

  const updateObjectiveItem = (index, value) => {
    updateArrayItem("objectivesItems", index, "text", value);
  };
  const addObjectiveItem = () => {
    addArrayItem("objectivesItems", (index) => ({ text: `Objective ${index + 1}` }));
  };
  const removeObjectiveItem = (index) => {
    removeArrayItem("objectivesItems", index);
  };

  const updateComparisonRow = (index, key, value) => {
    updateArrayItem("comparisonRows", index, key, value);
  };
  const addComparisonRow = () => {
    addArrayItem("comparisonRows", (index) => ({
      criterion: `Criteria ${index + 1}`,
      left: "",
      right: "",
    }));
  };
  const removeComparisonRow = (index) => {
    removeArrayItem("comparisonRows", index);
  };

  const updateTimelineEvent = (index, key, value) => {
    updateArrayItem("timelineEvents", index, key, value);
  };
  const addTimelineEvent = () => {
    addArrayItem("timelineEvents", (index) => ({
      title: `Event ${index + 1}`,
      detail: "",
    }));
  };
  const removeTimelineEvent = (index) => {
    removeArrayItem("timelineEvents", index);
  };

  const updateSummaryPoint = (index, value) => {
    updateArrayItem("summaryPoints", index, "text", value);
  };
  const addSummaryPoint = () => {
    addArrayItem("summaryPoints", (index) => ({ text: `Point ${index + 1}` }));
  };
  const removeSummaryPoint = (index) => {
    removeArrayItem("summaryPoints", index);
  };

  const updateScenarioOption = (index, key, value) => {
    updateArrayItem("scenarioOptions", index, key, value);
  };
  const addScenarioOption = () => {
    addArrayItem("scenarioOptions", (index) => ({
      title: `Response Path ${index + 1}`,
      detail: "",
    }));
  };
  const removeScenarioOption = (index) => {
    removeArrayItem("scenarioOptions", index);
  };

  const updateReflectionCheck = (index, value) => {
    updateArrayItem("reflectionChecks", index, "text", value);
  };
  const addReflectionCheck = () => {
    addArrayItem("reflectionChecks", (index) => ({ text: `Check ${index + 1}` }));
  };
  const removeReflectionCheck = (index) => {
    removeArrayItem("reflectionChecks", index);
  };

  const updateQuizOption = (index, value) => {
    updateArrayItem("quizOptions", index, "text", value);
  };
  const addQuizOption = () => {
    addArrayItem("quizOptions", (index) => ({ text: `Option ${index + 1}` }));
  };
  const removeQuizOption = (index) => {
    removeArrayItem("quizOptions", index);
  };

  const updateHotspotItem = (index, key, value) => {
    updateArrayItem("hotspotItems", index, key, value);
  };
  const addHotspotItem = () => {
    addArrayItem("hotspotItems", (index) => ({
      title: `Hotspot ${index + 1}`,
      content: "",
    }));
  };
  const removeHotspotItem = (index) => {
    removeArrayItem("hotspotItems", index);
  };

  const updateTabItem = (index, key, value) => {
    updateArrayItem("tabsItems", index, key, value);
  };
  const addTabItem = () => {
    addArrayItem("tabsItems", (index) => ({
      title: `Tab ${index + 1}`,
      content: "",
    }));
  };
  const removeTabItem = (index) => {
    removeArrayItem("tabsItems", index);
  };

  const updateAccordionSection = (index, key, value) => {
    updateArrayItem("accordionSections", index, key, value);
  };
  const addAccordionSection = () => {
    addArrayItem("accordionSections", (index) => ({
      title: `Section ${index + 1}`,
      content: "",
    }));
  };
  const removeAccordionSection = (index) => {
    removeArrayItem("accordionSections", index);
  };

  const updateProcessStep = (index, key, value) => {
    updateArrayItem("processSteps", index, key, value);
  };
  const addProcessStep = () => {
    addArrayItem("processSteps", (index) => ({
      title: `Step ${index + 1}`,
      description: "",
    }));
  };
  const removeProcessStep = (index) => {
    removeArrayItem("processSteps", index);
  };

  const applySafeAreaPreset = (safeAreaPreset) => {
    const preset =
      safeAreaPresetMap[safeAreaPreset] ??
      safeAreaPresetMap[DEFAULT_SAFE_AREA_VALUE] ??
      safeAreaPresets[0];

    setForm((prev) => ({
      ...prev,
      safeAreaPreset: preset.value,
      safeMargins: { ...preset.margins },
    }));
  };

  const resetSafeMarginsToDefault = () => {
    setForm((prev) => ({
      ...prev,
      safeAreaPreset: DEFAULT_SAFE_AREA_VALUE,
      safeMargins: { ...DEFAULT_SAFE_MARGINS },
    }));
  };

  const resetToCurrentScreenDefaults = () => {
    setForm((prev) => {
      const defaults = getScreenDefaults(prev.screenType || DEFAULT_SCREEN_TYPE);
      const nextDefaults = createInitialFormState(prev.screenType || DEFAULT_SCREEN_TYPE);

      return {
        ...prev,
        ...buildDynamicCollectionDefaults(defaults),
        title: defaults.title,
        body: defaults.body,
        cta: defaults.cta,
        layout: defaults.layout,
        templateId: getDefaultTemplateId({
          screenType: prev.screenType || DEFAULT_SCREEN_TYPE,
          layout: defaults.layout,
        }),
        safeAreaPreset: DEFAULT_SAFE_AREA_VALUE,
        safeMargins: { ...DEFAULT_SAFE_MARGINS },
        customSlideSize: cloneFieldValue(nextDefaults.customSlideSize),
      };
    });
  };

  return {
    switchScreenType,
    switchLayoutStyle,
    switchSlideSizePreset,
    applyTemplate,
    updateField,
    updateRepeaterItem,
    addRepeaterItem,
    removeRepeaterItem,
    updateCustomSlideSize,
    applySafeAreaPreset,
    updateSafeMargin,
    updateTitleHighlight,
    addTitleHighlight,
    removeTitleHighlight,
    updateContentBlock,
    addContentBlock,
    removeContentBlock,
    updateObjectiveItem,
    addObjectiveItem,
    removeObjectiveItem,
    updateComparisonRow,
    addComparisonRow,
    removeComparisonRow,
    updateTimelineEvent,
    addTimelineEvent,
    removeTimelineEvent,
    updateSummaryPoint,
    addSummaryPoint,
    removeSummaryPoint,
    updateScenarioOption,
    addScenarioOption,
    removeScenarioOption,
    updateReflectionCheck,
    addReflectionCheck,
    removeReflectionCheck,
    updateQuizOption,
    addQuizOption,
    removeQuizOption,
    updateHotspotItem,
    addHotspotItem,
    removeHotspotItem,
    updateTabItem,
    addTabItem,
    removeTabItem,
    updateAccordionSection,
    addAccordionSection,
    removeAccordionSection,
    updateProcessStep,
    addProcessStep,
    removeProcessStep,
    resetSafeMarginsToDefault,
    resetToCurrentScreenDefaults,
  };
}
