import { getResolvedSlideSize } from "@/components/storyline/slideSize";
import { layoutOptions } from "@/data/layoutOptions";
import { screenTypes } from "@/data/screenTypes";
import { themes } from "@/data/themes";

const PX_PER_INCH = 96;
const MIN_SAFE_CONTENT_PX = 80;
const PPTX_THEME_COLORS = {
  corporate: {
    canvas: "F5F9FF",
    surface: "FFFFFF",
    surfaceMuted: "EFF6FF",
    accent: "2563EB",
    accentSoft: "DBEAFE",
    accentText: "1D4ED8",
    textStrong: "0F172A",
    textBody: "334155",
    textMuted: "64748B",
    border: "CBD5E1",
    guide: "94A3B8",
    safe: "10B981",
    buttonText: "FFFFFF",
  },
  emerald: {
    canvas: "F4FBF7",
    surface: "FFFFFF",
    surfaceMuted: "ECFDF5",
    accent: "059669",
    accentSoft: "D1FAE5",
    accentText: "047857",
    textStrong: "0F172A",
    textBody: "334155",
    textMuted: "64748B",
    border: "B7E4D1",
    guide: "86B8A3",
    safe: "059669",
    buttonText: "FFFFFF",
  },
  violet: {
    canvas: "FAF7FF",
    surface: "FFFFFF",
    surfaceMuted: "F3E8FF",
    accent: "7C3AED",
    accentSoft: "E9D5FF",
    accentText: "6D28D9",
    textStrong: "1E1B4B",
    textBody: "4C1D95",
    textMuted: "7C3AED",
    border: "D8B4FE",
    guide: "C4B5FD",
    safe: "8B5CF6",
    buttonText: "FFFFFF",
  },
};

function pxToInches(value) {
  return Number(value) / PX_PER_INCH;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeMargins(safeMargins, slideWidth, slideHeight) {
  let top = clamp(Number(safeMargins?.top ?? 120), 0, slideHeight);
  let bottom = clamp(Number(safeMargins?.bottom ?? 140), 0, slideHeight);
  let left = clamp(Number(safeMargins?.left ?? 120), 0, slideWidth);
  let right = clamp(Number(safeMargins?.right ?? 120), 0, slideWidth);

  const maxVerticalTotal = Math.max(0, slideHeight - MIN_SAFE_CONTENT_PX);
  if (top + bottom > maxVerticalTotal) {
    const ratio = maxVerticalTotal / (top + bottom || 1);
    top = Math.round(top * ratio);
    bottom = Math.round(bottom * ratio);
  }

  const maxHorizontalTotal = Math.max(0, slideWidth - MIN_SAFE_CONTENT_PX);
  if (left + right > maxHorizontalTotal) {
    const ratio = maxHorizontalTotal / (left + right || 1);
    left = Math.round(left * ratio);
    right = Math.round(right * ratio);
  }

  return { top, bottom, left, right };
}

function getLayoutLabel(screenType, layout) {
  const options = layoutOptions[screenType] || [];
  return options.find((option) => option.value === layout)?.label || layout;
}

function normalizeInteractionLayout(layout) {
  return layout === "grid-hotspots" ? "click-reveal" : layout;
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

function formatCollectionItems(items, mapper) {
  if (!Array.isArray(items)) return [];
  return items.map(mapper).filter(Boolean);
}

export function getPptxContentSection(form) {
  switch (form.screenType) {
    case "title":
      return {
        label: "Title Highlights",
        items: normalizeTextItems(form.titleHighlights, "Highlight"),
      };
    case "content":
      return {
        label: "Content Blocks",
        items: formatCollectionItems(form.contentBlocks, (item, index) => {
          const title = item?.title?.trim() || `Block ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        }),
      };
    case "objectives":
      return {
        label: "Objectives",
        items: normalizeTextItems(form.objectivesItems, "Objective"),
      };
    case "process":
      return {
        label: "Process Steps",
        items: formatCollectionItems(form.processSteps, (item, index) => {
          const title = item?.title?.trim() || `Step ${index + 1}`;
          const description = item?.description?.trim() || "Description pending";
          return `${title}: ${description}`;
        }),
      };
    case "comparison":
      return {
        label: "Comparison Rows",
        items: formatCollectionItems(form.comparisonRows, (item, index) => {
          const criterion = item?.criterion?.trim() || `Criteria ${index + 1}`;
          const left = item?.left?.trim() || "Option A pending";
          const right = item?.right?.trim() || "Option B pending";
          return `${criterion}: ${left} vs ${right}`;
        }),
      };
    case "timeline":
      return {
        label: "Timeline Events",
        items: formatCollectionItems(form.timelineEvents, (item, index) => {
          const title = item?.title?.trim() || `Event ${index + 1}`;
          const detail = item?.detail?.trim() || "Event detail pending";
          return `${title}: ${detail}`;
        }),
      };
    case "summary":
      return {
        label: "Takeaways",
        items: normalizeTextItems(form.summaryPoints, "Point"),
      };
    case "tabs":
      return {
        label: "Tabs",
        items: formatCollectionItems(form.tabsItems, (item, index) => {
          const title = item?.title?.trim() || `Tab ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        }),
      };
    case "scenario":
      return {
        label: "Scenario Options",
        items: formatCollectionItems(form.scenarioOptions, (item, index) => {
          const title = item?.title?.trim() || `Response Path ${index + 1}`;
          const detail = item?.detail?.trim() || "Option detail pending";
          return `${title}: ${detail}`;
        }),
      };
    case "reflection":
      return {
        label: "Reflection Checks",
        items: normalizeTextItems(form.reflectionChecks, "Check"),
      };
    case "accordionInteraction":
      return {
        label: "Accordion Sections",
        items: formatCollectionItems(form.accordionSections, (item, index) => {
          const title = item?.title?.trim() || `Section ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        }),
      };
    case "quiz":
      return {
        label: "Answer Options",
        items: normalizeTextItems(form.quizOptions, "Option"),
      };
    case "interaction": {
      const normalizedLayout = normalizeInteractionLayout(form.layout);
      if (normalizedLayout === "tabs-interaction") {
        return {
          label: "Tabs",
          items: formatCollectionItems(form.tabsItems, (item, index) => {
            const title = item?.title?.trim() || `Tab ${index + 1}`;
            const content = item?.content?.trim() || "Content pending";
            return `${title}: ${content}`;
          }),
        };
      }
      if (normalizedLayout === "process-steps") {
        return {
          label: "Process Steps",
          items: formatCollectionItems(form.processSteps, (item, index) => {
            const title = item?.title?.trim() || `Step ${index + 1}`;
            const description = item?.description?.trim() || "Description pending";
            return `${title}: ${description}`;
          }),
        };
      }
      if (normalizedLayout === "accordion") {
        return {
          label: "Accordion Sections",
          items: formatCollectionItems(form.accordionSections, (item, index) => {
            const title = item?.title?.trim() || `Section ${index + 1}`;
            const content = item?.content?.trim() || "Content pending";
            return `${title}: ${content}`;
          }),
        };
      }

      return {
        label: "Hotspots",
        items: formatCollectionItems(form.hotspotItems, (item, index) => {
          const title = item?.title?.trim() || `Hotspot ${index + 1}`;
          const content = item?.content?.trim() || "Content pending";
          return `${title}: ${content}`;
        }),
      };
    }
    default:
      return { label: "Screen Content", items: [] };
  }
}

export function buildPptxExportModel(form) {
  const slideSize = getResolvedSlideSize(form);
  const safeMarginsPx = normalizeMargins(
    form.safeMargins,
    slideSize.width,
    slideSize.height,
  );

  const slideWidthIn = pxToInches(slideSize.width);
  const slideHeightIn = pxToInches(slideSize.height);

  const safeFramePx = {
    x: safeMarginsPx.left,
    y: safeMarginsPx.top,
    w: slideSize.width - safeMarginsPx.left - safeMarginsPx.right,
    h: slideSize.height - safeMarginsPx.top - safeMarginsPx.bottom,
  };

  const safeFrameIn = {
    x: pxToInches(safeFramePx.x),
    y: pxToInches(safeFramePx.y),
    w: pxToInches(safeFramePx.w),
    h: pxToInches(safeFramePx.h),
  };
  const contentSection = getPptxContentSection(form);
  const themeKey = Object.prototype.hasOwnProperty.call(PPTX_THEME_COLORS, form.theme)
    ? form.theme
    : "corporate";

  return {
    screenType: form.screenType,
    screenTypeName: screenTypes[form.screenType]?.name || form.screenType,
    layout: form.layout,
    layoutLabel: getLayoutLabel(form.screenType, form.layout),
    title:
      typeof form.title === "string" && form.title.trim().length > 0
        ? form.title.trim()
        : "Untitled Slide",
    body: typeof form.body === "string" ? form.body.trim() : "",
    cta:
      typeof form.cta === "string" && form.cta.trim().length > 0
        ? form.cta.trim()
        : "Continue",
    notes: form.notes || "",
    themeName: themes[form.theme]?.name || form.theme,
    themeKey,
    themeColors: PPTX_THEME_COLORS[themeKey],
    contentLabel: contentSection.label,
    contentItems: contentSection.items,
    showSafeGrid: form.showSafeGrid === true,
    slideSize: {
      label: slideSize.label,
      widthPx: slideSize.width,
      heightPx: slideSize.height,
      widthIn: slideWidthIn,
      heightIn: slideHeightIn,
    },
    safeMarginsPx,
    safeMarginsIn: {
      top: pxToInches(safeMarginsPx.top),
      bottom: pxToInches(safeMarginsPx.bottom),
      left: pxToInches(safeMarginsPx.left),
      right: pxToInches(safeMarginsPx.right),
    },
    safeFrameIn,
  };
}
