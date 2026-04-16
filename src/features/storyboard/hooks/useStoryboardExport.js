import { useCallback, useState } from "react";
import {
  parseImportedStoryboardPayload,
  STORYBOARD_SCHEMA_VERSION,
  validateSlideForExport,
} from "@/components/slideModel";

export function useStoryboardExport({
  form,
  slides,
  spec,
  currentSlideSize,
  selectedLayoutLabel,
  exportBaseName,
  screenTypes,
  themes,
  pushNotice,
  replaceStoryboard,
}) {
  const [importError, setImportError] = useState("");
  const [hasAttemptedExport, setHasAttemptedExport] = useState(false);

  const ensureCurrentSlideCanExport = useCallback(
    (label) => {
      setHasAttemptedExport(true);
      const validation = validateSlideForExport(form);
      if (validation.valid) {
        return true;
      }

      pushNotice(
        "error",
        `${label} unavailable. ${validation.issues.slice(0, 3).join(" ")}`,
      );
      return false;
    },
    [form, pushNotice],
  );

  const ensureStoryboardCanExport = useCallback(
    (label) => {
      setHasAttemptedExport(true);
      for (let index = 0; index < slides.length; index += 1) {
        const validation = validateSlideForExport(slides[index]);
        if (!validation.valid) {
          pushNotice(
            "error",
            `${label} unavailable. Slide ${index + 1}: ${validation.issues[0]}`,
          );
          return false;
        }
      }

      return true;
    },
    [pushNotice, slides],
  );

  const handleExportSpec = useCallback(() => {
    if (!ensureCurrentSlideCanExport("Spec export")) {
      return;
    }

    try {
      const payload = {
        meta: {
          app: "storyline-layout-app",
          schemaVersion: STORYBOARD_SCHEMA_VERSION,
          exportType: "slide-spec",
          exportedAt: new Date().toISOString(),
        },
        screenType: form.screenType,
        layout: form.layout,
        templateId: form.templateId ?? null,
        title: form.title,
        body: form.body,
        cta: form.cta,
        theme: form.theme,
        slideSize: {
          label: currentSlideSize.label,
          width: currentSlideSize.width,
          height: currentSlideSize.height,
        },
        safeMargins: {
          top: form.safeMargins.top,
          bottom: form.safeMargins.bottom,
          left: form.safeMargins.left,
          right: form.safeMargins.right,
        },
        designerNotes: form.notes,
        dynamicContent: {
          titleHighlights: form.titleHighlights,
          contentBlocks: form.contentBlocks,
          objectivesItems: form.objectivesItems,
          comparisonRows: form.comparisonRows,
          timelineEvents: form.timelineEvents,
          summaryPoints: form.summaryPoints,
          scenarioOptions: form.scenarioOptions,
          reflectionChecks: form.reflectionChecks,
          quizOptions: form.quizOptions,
          hotspotItems: form.hotspotItems,
          tabsItems: form.tabsItems,
          accordionSections: form.accordionSections,
          processSteps: form.processSteps,
        },
      };

      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportBaseName}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      pushNotice("success", "Spec JSON exported.");
    } catch (error) {
      console.error("Failed to export spec JSON", error);
      pushNotice("error", "Spec export failed. Please try again.");
    }
  }, [currentSlideSize.height, currentSlideSize.label, currentSlideSize.width, ensureCurrentSlideCanExport, exportBaseName, form, pushNotice]);

  const handleExportBrief = useCallback(() => {
    if (!ensureCurrentSlideCanExport("Production brief export")) {
      return;
    }

    try {
      const screenTypeName = screenTypes[form.screenType]?.name || form.screenType;
      const themeName = themes[form.theme]?.name || form.theme;
      const notes = form.notes?.trim() || "No production notes added.";
      const dynamicItems = Array.isArray(spec?.content?.dynamicItems)
        ? spec.content.dynamicItems
        : [];

      const brief = [
        "Screen Type",
        `${screenTypeName} (${form.screenType})`,
        "",
        "Layout Style",
        `${selectedLayoutLabel} (${form.layout})`,
        "",
        "Content",
        `Title: ${form.title}`,
        `Body: ${form.body}`,
        `CTA: ${form.cta}`,
        `Slide Size: ${currentSlideSize.label}`,
        ...(dynamicItems.length > 0
          ? ["Dynamic Items:", ...dynamicItems.map((item) => `- ${item}`)]
          : []),
        "",
        "Safe Margins",
        `Top: ${form.safeMargins.top}px`,
        `Bottom: ${form.safeMargins.bottom}px`,
        `Left: ${form.safeMargins.left}px`,
        `Right: ${form.safeMargins.right}px`,
        "",
        "Theme",
        themeName,
        "",
        "Notes",
        notes,
        "",
      ].join("\n");

      const blob = new Blob([brief], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportBaseName}-production-brief.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      pushNotice("success", "Production brief exported.");
    } catch (error) {
      console.error("Failed to export production brief", error);
      pushNotice("error", "Production brief export failed. Please try again.");
    }
  }, [currentSlideSize.label, ensureCurrentSlideCanExport, exportBaseName, form, pushNotice, screenTypes, selectedLayoutLabel, spec, themes]);

  const handleExportPptx = useCallback(async () => {
    if (!ensureStoryboardCanExport("Storyboard PPTX export")) {
      return;
    }

    try {
      const { exportStoryboardToPptx } = await import(
        "@/components/storyline/pptx/exportStoryboardToPptx"
      );
      await exportStoryboardToPptx(slides, {
        fileName: `storyboard-${slides.length}-slides.pptx`,
        title: "Storyboard Export",
      });
      pushNotice("success", "Storyboard PPTX exported.");
    } catch (error) {
      console.error("Failed to export PPTX", error);
      pushNotice("error", "Storyboard PPTX export failed. Please try again.");
    }
  }, [ensureStoryboardCanExport, pushNotice, slides]);

  const handleExportCurrentSlidePptx = useCallback(async () => {
    if (!ensureCurrentSlideCanExport("Current slide PPTX export")) {
      return;
    }

    try {
      const { exportCurrentSlideToPptx } = await import(
        "@/components/storyline/pptx/exportCurrentSlideToPptx"
      );
      await exportCurrentSlideToPptx(form, {
        fileName: `${exportBaseName}.pptx`,
        title: "Current Layout Export",
      });
      pushNotice("success", "Current slide PPTX exported.");
    } catch (error) {
      console.error("Failed to export current slide PPTX", error);
      pushNotice("error", "Current slide PPTX export failed. Please try again.");
    }
  }, [ensureCurrentSlideCanExport, exportBaseName, form, pushNotice]);

  const handleImportStoryboardJson = useCallback(async (file) => {
    if (!file) return;

    try {
      const rawText = await file.text();
      let parsed = null;

      try {
        parsed = JSON.parse(rawText);
      } catch {
        throw new Error("Invalid JSON file. Please upload a valid storyboard JSON.");
      }

      const imported = parseImportedStoryboardPayload(parsed);
      replaceStoryboard(imported);
      setImportError("");
      pushNotice("success", `Storyboard imported with ${imported.slides.length} slide${imported.slides.length === 1 ? "" : "s"}.`);
    } catch (error) {
      const message =
        error?.message ||
        "Could not import storyboard. Please check the JSON file and try again.";
      setImportError(message);
      pushNotice("error", message);
    }
  }, [pushNotice, replaceStoryboard]);

  return {
    importError,
    hasAttemptedExport,
    handleExportSpec,
    handleExportBrief,
    handleExportPptx,
    handleExportCurrentSlidePptx,
    handleImportStoryboardJson,
  };
}
