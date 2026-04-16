import { CheckCircle2, CircleAlert, Copy, FileText, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/features/storyboard/components/storyboardSidebarHelpers";

export function WorkflowStatusCard({
  currentTheme,
  form,
  slides,
  activeSlideId,
  screenTypes,
  workflowProgress,
  exportReadiness,
  onCreateSlide,
  onDuplicateSlide,
  onOpenBrief,
}) {
  const activeSlideIndex = slides.findIndex((slide) => slide.id === activeSlideId);

  return (
    <SectionCard
      title="Workflow Status"
      description="Follow the authoring flow and see whether the active slide is ready for handoff."
      className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
    >
      <div className="grid gap-3.5 md:grid-cols-2">
        <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-3.5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Active slide
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            Slide {activeSlideIndex + 1} of {slides.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {screenTypes[form.screenType]?.name || form.screenType}
          </p>
        </div>

        <div
          className={cn(
            "rounded-[22px] border p-3.5 shadow-sm",
            exportReadiness.valid
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50",
          )}
        >
          <div className="flex items-center gap-2">
            {exportReadiness.valid ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <CircleAlert className="h-4 w-4 text-amber-600" />
            )}
            <p className="text-sm font-semibold text-slate-900">{exportReadiness.headline}</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">{exportReadiness.summary}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Progress
          </p>
          <p className="text-xs text-slate-500">{workflowProgress.completedCount}/3 complete</p>
        </div>

        <div className="space-y-2">
          {workflowProgress.steps.map((step) => (
            <div
              key={step.label}
              className={cn(
                "flex items-start gap-3 rounded-[22px] border p-3.5 shadow-sm",
                step.done ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white",
              )}
            >
              <div className="mt-0.5">
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Sparkles className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{step.label}</p>
                <p className="text-xs leading-5 text-slate-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-200/80 pt-3">
        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onCreateSlide}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Slide
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => onDuplicateSlide(activeSlideId)}
        >
          <Copy className="mr-1 h-3.5 w-3.5" />
          Duplicate Active
        </Button>
        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onOpenBrief}>
          <FileText className="mr-1 h-3.5 w-3.5" />
          Review Brief
        </Button>
      </div>
    </SectionCard>
  );
}
