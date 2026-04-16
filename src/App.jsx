import { useEffect, useState } from "react";
import { PreviewCanvas } from "@/components/storyline/PreviewCanvas";
import { useStoryboardNotices } from "@/features/storyboard/hooks/useStoryboardNotices";
import { useStoryboardPersistence } from "@/features/storyboard/hooks/useStoryboardPersistence";
import { useSlideActions } from "@/features/storyboard/hooks/useSlideActions";
import { useStoryboardExport } from "@/features/storyboard/hooks/useStoryboardExport";
import { ProductionBrief } from "@/components/storyline/ProductionBrief";
import { StoryboardSidebar } from "@/components/StoryboardSidebar";
import { ConfirmationDialog } from "@/features/storyboard/components/ConfirmationDialog";
import { generateSpec } from "@/components/storyline/generateSpec";
import { getResolvedSlideSize } from "@/components/storyline/slideSize";
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

export default function StorylineLayoutGenerator() {
  const {
    initialSlides,
    initialActiveSlideId,
    saveStatus,
    initialNotice,
    persistenceNotice,
    saveStoryboardState,
  } = useStoryboardPersistence();
  const [previewZoom, setPreviewZoom] = useState("100");
  const [workspaceTab, setWorkspaceTab] = useState("preview");
  const { appNotice, dismissNotice, pushNotice } = useStoryboardNotices(initialNotice);
  const {
    slides,
    activeSlideId,
    form,
    formActions,
    replaceStoryboard,
    deleteDialog,
    handleCreateSlide,
    handleStartBlankStoryboard,
    handleLoadSampleStoryboard,
    handleSelectSlide,
    handleDuplicateSlide,
    handleDeleteSlide,
    handleCancelDeleteSlide,
    handleConfirmDeleteSlide,
    handleMoveSlideUp,
    handleMoveSlideDown,
  } = useSlideActions({
    initialSlides,
    initialActiveSlideId,
    onPersist: saveStoryboardState,
    pushNotice,
  });
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

  useEffect(() => {
    if (!persistenceNotice) return;

    pushNotice(persistenceNotice.tone, persistenceNotice.message);
  }, [persistenceNotice, pushNotice]);

  const handleOpenBrief = () => {
    setWorkspaceTab("spec");
  };

  const {
    importError,
    hasAttemptedExport,
    handleExportSpec,
    handleExportBrief,
    handleExportPptx,
    handleExportCurrentSlidePptx,
    handleImportStoryboardJson,
  } = useStoryboardExport({
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
  });

  return (
    <div
      className={`min-h-screen ${currentTheme.page} p-4 md:p-6 lg:h-screen lg:overflow-hidden`}
    >
      {appNotice ? (
        <div
          role={appNotice.tone === "error" ? "alert" : "status"}
          aria-live={appNotice.tone === "error" ? "assertive" : "polite"}
          className={`mx-auto mb-4 flex max-w-[1560px] items-start justify-between gap-3 rounded-3xl border px-4 py-3.5 text-sm shadow-sm backdrop-blur-sm ring-1 ring-slate-950/5 ${NOTICE_STYLES[appNotice.tone] || NOTICE_STYLES.info}`}
        >
          <p>{appNotice.message}</p>
          <button
            type="button"
            className="rounded-full border border-current/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100"
            onClick={dismissNotice}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <ConfirmationDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        description={deleteDialog.description}
        confirmLabel={deleteDialog.confirmLabel}
        cancelLabel={deleteDialog.cancelLabel}
        confirmTone={deleteDialog.confirmTone}
        onConfirm={handleConfirmDeleteSlide}
        onCancel={handleCancelDeleteSlide}
      />

      <div className="mx-auto grid max-w-[1560px] gap-5 lg:h-full lg:grid-cols-[minmax(360px,460px)_minmax(0,1fr)] lg:items-stretch">
        <StoryboardSidebar
          form={form}
          formActions={formActions}
          saveStatus={saveStatus}
          slides={slides}
          activeSlideId={activeSlideId}
          onSelectSlide={handleSelectSlide}
          onCreateSlide={handleCreateSlide}
          onStartBlankStoryboard={handleStartBlankStoryboard}
          onLoadSampleStoryboard={handleLoadSampleStoryboard}
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
          hasAttemptedExport={hasAttemptedExport}
          workspaceTab={workspaceTab}
          onTemplateApplied={(template) => {
            if (!template?.name) return;
            pushNotice("info", `Template updated to ${template.name}. Existing copy preserved where possible.`);
          }}
        />

        <div className="min-w-0 lg:h-full">
          <Tabs
            value={workspaceTab}
            onValueChange={setWorkspaceTab}
            className="w-full lg:flex lg:h-full lg:flex-col"
          >
            <TabsList
              className={`grid w-full grid-cols-2 rounded-2xl p-1.5 shadow-sm backdrop-blur-sm ring-1 ${currentTheme.surface} ${currentTheme.surfaceBorder}`}
            >
              <TabsTrigger value="preview" className="rounded-xl text-sm font-medium">
                Preview
              </TabsTrigger>
              <TabsTrigger value="spec" className="rounded-xl text-sm font-medium">
                Production Brief
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4 lg:mt-3 lg:min-h-0 lg:flex-1">
              <Card
                className={`overflow-hidden rounded-3xl border shadow-sm lg:h-full ${currentTheme.surface} ${currentTheme.surfaceBorder}`}
              >
                <CardContent className="p-4 md:p-5 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
                  <div
                    className={`mb-4 rounded-[24px] border px-4 py-4 shadow-sm ${currentTheme.surfaceMuted} ${currentTheme.surfaceBorder}`}
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
                className={`overflow-hidden rounded-3xl border shadow-sm lg:h-full ${currentTheme.surface} ${currentTheme.surfaceBorder}`}
              >
                <CardContent className="p-5 lg:h-full lg:overflow-y-auto lg:p-6 lg:pr-4">
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

