import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/features/storyboard/components/storyboardSidebarHelpers";
import { getSlideLayoutLabel } from "@/features/storyboard/utils/storyboardSidebarUtils";

export function StoryboardNavigator({
  currentTheme,
  slides,
  activeSlideId,
  screenTypes,
  layoutOptionsMap,
  onSelectSlide,
  onCreateSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlideUp,
  onMoveSlideDown,
}) {
  return (
    <SectionCard
      title="Storyboard"
      description="Manage slide sequence, order, and duplication from one place."
      action={
        <Button type="button" size="sm" className="rounded-xl" onClick={onCreateSlide}>
          <Plus className="mr-1 h-4 w-4" />
          Add Slide
        </Button>
      }
      className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 shadow-sm">
          <p className="text-xs font-medium text-slate-600">
            {slides.length} slide{slides.length === 1 ? "" : "s"} in storyboard
          </p>
          <p className="text-xs text-slate-500">Active slide stays in sync with preview</p>
        </div>

        <div className="max-h-[26rem] space-y-2 overflow-y-auto pr-1">
          {slides.map((slide, index) => {
            const isActive = slide.id === activeSlideId;
            const screenName = screenTypes[slide.screenType]?.name || slide.screenType;
            const title = slide.title?.trim() || "Untitled slide";
            const layoutLabel = getSlideLayoutLabel(slide, layoutOptionsMap);

            return (
              <div
                key={slide.id}
                className={cn(
                  "rounded-[22px] border p-3 transition-all shadow-sm",
                  isActive
                    ? `${currentTheme.activeSurface} ${currentTheme.activeBorder}`
                    : "border-slate-200 bg-white hover:-translate-y-px hover:bg-slate-50 hover:shadow-md",
                )}
              >
                <button type="button" onClick={() => onSelectSlide(slide.id)} className="w-full text-left">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", isActive ? currentTheme.activeText : "text-slate-500")}>
                        Slide {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
                    </div>
                    <span className="max-w-[9rem] truncate rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                      {screenName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{layoutLabel}</p>
                </button>

                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-200/80 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Move slide ${index + 1} up`}
                    onClick={() => onMoveSlideUp(slide.id)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Move slide ${index + 1} down`}
                    onClick={() => onMoveSlideDown(slide.id)}
                    disabled={index === slides.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="rounded-xl" onClick={() => onDuplicateSlide(slide.id)}>
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Duplicate
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onDeleteSlide(slide.id)}
                    disabled={slides.length <= 1}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
