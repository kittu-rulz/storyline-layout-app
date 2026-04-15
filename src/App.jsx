import { useCallback, useEffect, useMemo, useState } from "react";
import { PreviewCanvas } from "@/components/storyline/PreviewCanvas";
import { ProductionBrief } from "@/components/storyline/ProductionBrief";
import { StoryboardSidebar } from "@/components/StoryboardSidebar";
import {
  createFormActions,
  createInitialFormState,
} from "@/components/storylineFormState";
import { generateSpec } from "@/components/storyline/generateSpec";
import { getResolvedSlideSize } from "@/components/storyline/slideSize";
import {
  cloneSlideForDuplicate,
  createStoryboardSlide,
  parseImportedStoryboardPayload,
  sanitizeSavedSlide,
  STORYBOARD_SCHEMA_VERSION,
  validateSlideForExport,
} from "@/components/slideModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { layoutOptions } from "@/data/layoutOptions";
import { safeAreaPresets } from "@/data/safeAreaPresets";
import { slideSizePresets } from "@/data/slideSizes";
import { screenTypes } from "@/data/screenTypes";
import { themes } from "@/data/themes";

const STORYBOARD_STORAGE_KEY = "storyline-layout-app.storyboard.v1";
const STORYBOARD_BACKUP_STORAGE_KEY = `${STORYBOARD_STORAGE_KEY}.backup`;
const PREVIEW_ZOOM_OPTIONS = ["50", "75", "100", "125"];
const NOTICE_STYLES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

function toSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createDefaultStoryboardState() {
  const firstSlide = createStoryboardSlide();
  return {
    slides: [firstSlide],
    activeSlideId: firstSlide.id,
    saveStatus: "All changes saved locally",
    notice: null,
  };
}

function createPersistedStoryboardPayload(slides, activeSlideId) {
  return {
    schemaVersion: STORYBOARD_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    slides,
    activeSlideId,
  };
}

function getLoadedStoryboardState(parsed, options = {}) {
  if (!parsed || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
    return createDefaultStoryboardState();
  }

  const slides = parsed.slides.map((slide) => sanitizeSavedSlide(slide));
  const activeSlideId =
    typeof parsed.activeSlideId === "string" &&
    slides.some((slide) => slide.id === parsed.activeSlideId)
      ? parsed.activeSlideId
      : slides[0].id;

  return {
    slides,
    activeSlideId,
    saveStatus: options.recoveredFromBackup
      ? "Recovered your storyboard from backup"
      : "All changes saved locally",
    notice: options.recoveredFromBackup
      ? {
          tone: "info",
          message: "Recovered your storyboard from backup after a save issue.",
        }
      : null,
  };
}

function loadStoryboardState() {
  if (typeof window === "undefined") {
    return createDefaultStoryboardState();
  }

  try {
    const raw = window.localStorage.getItem(STORYBOARD_STORAGE_KEY);
    if (!raw) {
      return createDefaultStoryboardState();
    }

    const parsed = JSON.parse(raw);
    return getLoadedStoryboardState(parsed);
  } catch (error) {
    console.error("Failed to load storyboard from localStorage", error);

    try {
      const backupRaw = window.localStorage.getItem(STORYBOARD_BACKUP_STORAGE_KEY);
      if (!backupRaw) {
        return createDefaultStoryboardState();
      }

      const backupParsed = JSON.parse(backupRaw);
      return getLoadedStoryboardState(backupParsed, { recoveredFromBackup: true });
    } catch (backupError) {
      console.error("Failed to load storyboard backup from localStorage", backupError);
      return {
        ...createDefaultStoryboardState(),
        notice: {
          tone: "error",
          message: "Saved storyboard data could not be restored. Starting with a fresh workspace.",
        },
      };
    }
  }
}

export default function StorylineLayoutGenerator() {
  const initialStoryboardState = useMemo(() => loadStoryboardState(), []);
  const [slides, setSlides] = useState(() => initialStoryboardState.slides);
  const [activeSlideId, setActiveSlideId] = useState(
    () => initialStoryboardState.activeSlideId,
  );
  const [previewZoom, setPreviewZoom] = useState("100");
  const [importError, setImportError] = useState("");
  const [workspaceTab, setWorkspaceTab] = useState("preview");
  const [appNotice, setAppNotice] = useState(() => initialStoryboardState.notice);
  const [saveStatus, setSaveStatus] = useState(
    () => initialStoryboardState.saveStatus || "All changes saved locally",
  );

  const form =
    slides.find((slide) => slide.id === activeSlideId) ?? slides[0] ?? createInitialFormState();
  const currentTheme = themes[form.theme] ?? themes.corporate;
  const currentLayoutOptions = layoutOptions[form.screenType] || [];
  const selectedLayoutLabel =
    currentLayoutOptions.find((option) => option.value === form.layout)?.label ||
    form.layout;
  const currentSlideSize = getResolvedSlideSize(form);
  const spec = generateSpec(form);
  const screenTypePart = toSlug(form.screenType) || "screen";
  const layoutPart = toSlug(selectedLayoutLabel) || "layout";
  const exportBaseName = `${screenTypePart}-${layoutPart}`;

  const setActiveSlideForm = useCallback(
    (nextValueOrUpdater) => {
      setSlides((prevSlides) =>
        prevSlides.map((slide) => {
          if (slide.id !== activeSlideId) return slide;

          const nextSlide =
            typeof nextValueOrUpdater === "function"
              ? nextValueOrUpdater(slide)
              : nextValueOrUpdater;

          return {
            ...nextSlide,
            id: slide.id,
          };
        }),
      );
    },
    [activeSlideId],
  );

  const formActions = useMemo(
    () => createFormActions(setActiveSlideForm),
    [setActiveSlideForm],
  );

  const pushNotice = useCallback((tone, message) => {
    setAppNotice({
      id: `${tone}-${Date.now()}`,
      tone,
      message,
    });
  }, []);

  const ensureCurrentSlideCanExport = useCallback(
    (label) => {
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

  useEffect(() => {
    if (!appNotice) return undefined;

    const timeoutId = window.setTimeout(() => {
      setAppNotice(null);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [appNotice]);

  const handleOpenBrief = () => {
    setWorkspaceTab("spec");
  };

  const handleExportSpec = () => {
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
  };

  const handleExportBrief = () => {
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
  };

  const handleExportPptx = async () => {
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
  };

  const handleExportCurrentSlidePptx = async () => {
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
  };

  const handleImportStoryboardJson = async (file) => {
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
      setSlides(imported.slides);
      setActiveSlideId(imported.activeSlideId);
      setImportError("");
      pushNotice("success", `Storyboard imported with ${imported.slides.length} slide${imported.slides.length === 1 ? "" : "s"}.`);
    } catch (error) {
      const message =
        error?.message ||
        "Could not import storyboard. Please check the JSON file and try again.";
      setImportError(message);
      pushNotice("error", message);
    }
  };

  const handleCreateSlide = () => {
    const newSlide = createStoryboardSlide(form.screenType);
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideId(newSlide.id);
    pushNotice("success", "New slide added to the storyboard.");
  };

  const handleSelectSlide = (slideId) => {
    setActiveSlideId(slideId);
  };

  const handleDuplicateSlide = (slideId) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === slideId);
      if (index < 0) return prev;

      const duplicated = cloneSlideForDuplicate(prev[index]);
      const next = [...prev];
      next.splice(index + 1, 0, duplicated);
      setActiveSlideId(duplicated.id);
      return next;
    });
    pushNotice("success", "Slide duplicated.");
  };

  const handleDeleteSlide = (slideId) => {
    const slideToDelete = slides.find((slide) => slide.id === slideId);

    if (slides.length <= 1) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${slideToDelete?.title?.trim() || "Untitled slide"}" from the storyboard?`,
    );

    if (!confirmed) {
      pushNotice("info", "Slide deletion canceled.");
      return;
    }

    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === slideId);
      if (index < 0) return prev;

      const next = prev.filter((slide) => slide.id !== slideId);
      if (slideId === activeSlideId) {
        const fallbackIndex = Math.max(0, index - 1);
        const nextActive = next[fallbackIndex] || next[0];
        setActiveSlideId(nextActive.id);
      }

      return next;
    });

    pushNotice("success", "Slide removed from the storyboard.");
  };

  const handleMoveSlideUp = (slideId) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === slideId);
      if (index <= 0) return prev;

      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveSlideDown = (slideId) => {
    setSlides((prev) => {
      const index = prev.findIndex((slide) => slide.id === slideId);
      if (index < 0 || index >= prev.length - 1) return prev;

      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    setSaveStatus("Saving changes locally…");

    try {
      const payload = JSON.stringify(
        createPersistedStoryboardPayload(slides, activeSlideId),
      );
      window.localStorage.setItem(STORYBOARD_STORAGE_KEY, payload);
      window.localStorage.setItem(STORYBOARD_BACKUP_STORAGE_KEY, payload);
      setSaveStatus("All changes saved locally");
    } catch (error) {
      console.error("Failed to save storyboard to localStorage", error);
      setSaveStatus("Local save unavailable");
      pushNotice(
        "error",
        "Autosave failed in this browser session. Continue working, then export your storyboard manually.",
      );
    }
  }, [activeSlideId, pushNotice, slides]);

  return (
    <div
      className={`min-h-screen ${currentTheme.page} p-4 md:p-6 lg:h-screen lg:overflow-hidden`}
    >
      {appNotice ? (
        <div
          role={appNotice.tone === "error" ? "alert" : "status"}
          aria-live={appNotice.tone === "error" ? "assertive" : "polite"}
          className={`mx-auto mb-4 flex max-w-[1560px] items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${NOTICE_STYLES[appNotice.tone] || NOTICE_STYLES.info}`}
        >
          <p>{appNotice.message}</p>
          <button
            type="button"
            className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100"
            onClick={() => setAppNotice(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1560px] gap-5 lg:h-full lg:grid-cols-[minmax(360px,460px)_minmax(0,1fr)] lg:items-stretch">
        <StoryboardSidebar
          form={form}
          formActions={formActions}
          saveStatus={saveStatus}
          slides={slides}
          activeSlideId={activeSlideId}
          onSelectSlide={handleSelectSlide}
          onCreateSlide={handleCreateSlide}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onMoveSlideUp={handleMoveSlideUp}
          onMoveSlideDown={handleMoveSlideDown}
          layoutOptionsMap={layoutOptions}
          currentLayoutOptions={currentLayoutOptions}
          slideSizePresets={slideSizePresets}
          safeAreaPresets={safeAreaPresets}
          screenTypes={screenTypes}
          themes={themes}
          onOpenBrief={handleOpenBrief}
          onExportSpec={handleExportSpec}
          onExportBrief={handleExportBrief}
          onExportCurrentPptx={handleExportCurrentSlidePptx}
          onExportPptx={handleExportPptx}
          onImportStoryboardJson={handleImportStoryboardJson}
          importError={importError}
          workspaceTab={workspaceTab}
        />

        <div className="min-w-0 lg:h-full">
          <Tabs
            value={workspaceTab}
            onValueChange={setWorkspaceTab}
            className="w-full lg:flex lg:h-full lg:flex-col"
          >
            <TabsList
              className={`grid w-full grid-cols-2 rounded-2xl p-1 ring-1 ${currentTheme.surface} ${currentTheme.surfaceBorder}`}
            >
              <TabsTrigger value="preview" className="rounded-xl">
                Preview
              </TabsTrigger>
              <TabsTrigger value="spec" className="rounded-xl">
                Production Brief
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4 lg:mt-3 lg:min-h-0 lg:flex-1">
              <Card
                className={`rounded-3xl border shadow-sm lg:h-full ${currentTheme.surface} ${currentTheme.surfaceBorder}`}
              >
                <CardContent className="p-4 md:p-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
                  <div
                    className={`mb-4 rounded-2xl border p-4 ${currentTheme.surfaceMuted} ${currentTheme.surfaceBorder}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className={`text-sm font-semibold ${currentTheme.textStrong}`}>
                          Preview
                        </h3>
                        <p className={`text-xs ${currentTheme.textMuted}`}>
                          Slide size: {currentSlideSize.width} x {currentSlideSize.height} px
                        </p>
                      </div>
                      <div className="w-[110px]">
                        <Select value={previewZoom} onValueChange={setPreviewZoom}>
                          <SelectTrigger className="h-9 rounded-xl" aria-label="Preview zoom">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PREVIEW_ZOOM_OPTIONS.map((zoom) => (
                              <SelectItem key={zoom} value={zoom}>
                                {zoom}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        variant={form.showSafeGrid ? "secondary" : "outline"}
                        size="sm"
                        className="rounded-xl"
                        onClick={() =>
                          formActions.updateField("showSafeGrid", !form.showSafeGrid)
                        }
                      >
                        {form.showSafeGrid ? "Hide production guides" : "Show production guides"}
                      </Button>
                      <p className={`text-xs ${currentTheme.textMuted}`}>
                        Fine-tune labels, rulers, and grid density from the Production Guides
                        section in the sidebar.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`min-h-0 flex-1 overflow-auto rounded-2xl border p-2 ${currentTheme.surfaceMuted} ${currentTheme.surfaceBorder}`}
                  >
                    <div
                      className="mx-auto min-w-[280px] transition-[width] duration-200 ease-out"
                      style={{ width: `${previewZoom}%` }}
                    >
                      <PreviewCanvas
                        key={`${form.id}-${form.screenType}-${form.layout}`}
                        form={form}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spec" className="mt-4 lg:mt-3 lg:min-h-0 lg:flex-1">
              <Card
                className={`rounded-3xl border shadow-sm lg:h-full ${currentTheme.surface} ${currentTheme.surfaceBorder}`}
              >
                <CardContent className="p-6 lg:h-full lg:overflow-y-auto lg:pr-4">
                  <ProductionBrief spec={spec} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

