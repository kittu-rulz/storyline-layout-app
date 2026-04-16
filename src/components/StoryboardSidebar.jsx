import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate } from "lucide-react";
import { FirstRunGuidance } from "@/features/storyboard/components/FirstRunGuidance";
import { WorkflowStatusCard } from "@/features/storyboard/components/WorkflowStatusCard";
import { StoryboardNavigator } from "@/features/storyboard/components/StoryboardNavigator";
import { SlideSetupPanel } from "@/features/storyboard/components/SlideSetupPanel";
import { SlideContentPanel } from "@/features/storyboard/components/SlideContentPanel";
import { HandoffPanel } from "@/features/storyboard/components/HandoffPanel";
import { ImportExportPanel } from "@/features/storyboard/components/ImportExportPanel";
import { getExportReadiness } from "@/features/storyboard/utils/getExportReadiness";
import { getFieldValidationMap } from "@/features/storyboard/utils/getFieldValidationMap";
import { getWorkflowSteps } from "@/features/storyboard/utils/getWorkflowSteps";
import {
  FIRST_RUN_GUIDANCE_DISMISSED_KEY,
  getFirstRunGuidanceState,
} from "@/features/storyboard/utils/getFirstRunGuidanceState";
import { cn } from "@/lib/utils";
import { getTemplateById } from "@/features/storyboard/templates";

export function StoryboardSidebar({
  form,
  formActions,
  saveStatus,
  slides,
  activeSlideId,
  onSelectSlide,
  onCreateSlide,
  onStartBlankStoryboard,
  onLoadSampleStoryboard,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlideUp,
  onMoveSlideDown,
  layoutOptionsMap,
  currentLayoutOptions,
  slideSizePresets,
  safeAreaPresets,
  screenTypes,
  themes,
  onOpenBrief,
  onExportSpec,
  onExportBrief,
  onExportCurrentPptx,
  onExportPptx,
  onImportStoryboardJson,
  importError,
  hasAttemptedExport,
  workspaceTab,
  onTemplateApplied,
}) {
  const currentTheme = themes[form.theme] ?? themes.corporate;
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    try {
      return window.localStorage.getItem(FIRST_RUN_GUIDANCE_DISMISSED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [isTemplatePickerOpen, setTemplatePickerOpen] = useState(false);
  const exportReadiness = useMemo(() => getExportReadiness(form), [form]);
  const fieldValidationMap = useMemo(
    () => getFieldValidationMap(form, { hasAttemptedExport }),
    [form, hasAttemptedExport],
  );
  const workflowProgress = useMemo(
    () => getWorkflowSteps({ form, workspaceTab, exportReadiness }),
    [exportReadiness, form, workspaceTab],
  );
  const firstRunGuidance = useMemo(
    () => getFirstRunGuidanceState({ slides, dismissed: onboardingDismissed }),
    [onboardingDismissed, slides],
  );

  const dismissOnboarding = useCallback(() => {
    setOnboardingDismissed(true);
    try {
      window.localStorage.setItem(FIRST_RUN_GUIDANCE_DISMISSED_KEY, "true");
    } catch {
      // Ignore storage errors in the UI layer.
    }
  }, []);

  const handleStartBlankGuidance = useCallback(() => {
    dismissOnboarding();
    onStartBlankStoryboard?.();
  }, [dismissOnboarding, onStartBlankStoryboard]);

  const handleLoadSampleGuidance = useCallback(() => {
    dismissOnboarding();
    onLoadSampleStoryboard?.();
  }, [dismissOnboarding, onLoadSampleStoryboard]);

  const handleImportGuidance = useCallback(
    (file) => {
      dismissOnboarding();
      onImportStoryboardJson?.(file);
    },
    [dismissOnboarding, onImportStoryboardJson],
  );

  return (
    <Card
      className={cn(
        "w-full rounded-[34px] border bg-white/80 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm lg:flex lg:h-full lg:flex-col lg:overflow-hidden",
        currentTheme.shell,
        currentTheme.shellBorder,
      )}
    >
      <CardHeader className={cn("border-b pb-5 pt-1", currentTheme.shellBorder)}>
        <CardTitle className="flex items-start gap-3">
          <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-slate-950/5 shadow-sm", currentTheme.accentSoft)}>
            <LayoutTemplate className={cn("size-5", currentTheme.accentText)} />
          </div>
          <div className="space-y-2.5">
            <div className="space-y-1">
              <div className="text-xl font-semibold tracking-tight text-slate-950">Storyboard Workspace</div>
              <p className="text-sm leading-6 text-slate-600">
                Plan Storyline screens with cleaner structure, clearer layout choices,
                and handoff-ready output.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                  currentTheme.accentSoft,
                  currentTheme.accentBorder,
                  currentTheme.accentText,
                )}
              >
                {workspaceTab === "spec" ? "Production brief open" : "Preview editing"}
              </span>
              <span className="text-xs leading-5 text-slate-500">
                Screen type changes keep your current copy when possible.
              </span>
              <span
                role="status"
                aria-live="polite"
                className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm"
              >
                {saveStatus}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
        {firstRunGuidance.shouldShow ? (
          <FirstRunGuidance
            currentTheme={currentTheme}
            onStartBlank={handleStartBlankGuidance}
            onImportStoryboard={handleImportGuidance}
            onLoadSample={handleLoadSampleGuidance}
            onDismiss={dismissOnboarding}
          />
        ) : null}

        <WorkflowStatusCard
          currentTheme={currentTheme}
          form={form}
          slides={slides}
          activeSlideId={activeSlideId}
          screenTypes={screenTypes}
          workflowProgress={workflowProgress}
          exportReadiness={exportReadiness}
          onCreateSlide={onCreateSlide}
          onDuplicateSlide={onDuplicateSlide}
          onOpenBrief={onOpenBrief}
        />

        <StoryboardNavigator
          currentTheme={currentTheme}
          slides={slides}
          activeSlideId={activeSlideId}
          screenTypes={screenTypes}
          layoutOptionsMap={layoutOptionsMap}
          onSelectSlide={onSelectSlide}
          onCreateSlide={onCreateSlide}
          onDuplicateSlide={onDuplicateSlide}
          onDeleteSlide={onDeleteSlide}
          onMoveSlideUp={onMoveSlideUp}
          onMoveSlideDown={onMoveSlideDown}
        />

        <SlideSetupPanel
          currentTheme={currentTheme}
          form={form}
          formActions={formActions}
          currentLayoutOptions={currentLayoutOptions}
          screenTypes={screenTypes}
          slideSizePresets={slideSizePresets}
          safeAreaPresets={safeAreaPresets}
          themes={themes}
          fieldValidationMap={fieldValidationMap}
          isTemplatePickerOpen={isTemplatePickerOpen}
          onToggleTemplatePicker={() => setTemplatePickerOpen((open) => !open)}
          onCloseTemplatePicker={() => setTemplatePickerOpen(false)}
          onSelectTemplate={(templateId) => {
            formActions.applyTemplate(templateId);
            onTemplateApplied?.(getTemplateById(templateId));
            setTemplatePickerOpen(false);
          }}
        />

        <SlideContentPanel
          currentTheme={currentTheme}
          form={form}
          formActions={formActions}
          fieldValidationMap={fieldValidationMap}
        />

        <HandoffPanel
          currentTheme={currentTheme}
          onOpenBrief={onOpenBrief}
          exportReadiness={exportReadiness}
        >
          <ImportExportPanel
            onExportSpec={onExportSpec}
            onExportBrief={onExportBrief}
            onExportCurrentPptx={onExportCurrentPptx}
            onExportPptx={onExportPptx}
            onImportStoryboardJson={onImportStoryboardJson}
            importError={importError}
            exportReadiness={exportReadiness}
          />
        </HandoffPanel>
      </CardContent>
    </Card>
  );
}
