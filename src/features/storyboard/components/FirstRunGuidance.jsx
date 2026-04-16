import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/features/storyboard/components/storyboardSidebarHelpers";

export function FirstRunGuidance({
  currentTheme,
  onStartBlank,
  onImportStoryboard,
  onLoadSample,
  onDismiss,
}) {
  const importInputRef = useRef(null);

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportStoryboard?.(file);
    }
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImportChange}
      />

      <SectionCard
        title="Getting started"
        description="Use one of these quick actions to begin your storyboard."
        className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
        action={
          <Button type="button" variant="ghost" size="sm" className="rounded-xl" onClick={onDismiss}>
            Dismiss
          </Button>
        }
      >
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
          <div className="grid gap-2 md:grid-cols-3">
            <Button type="button" className={cn("justify-start rounded-2xl text-white shadow-sm", currentTheme.button)} onClick={onStartBlank}>
              Start with blank slide
            </Button>
            <Button type="button" variant="outline" className="justify-start rounded-2xl bg-white/90" onClick={handleImportClick}>
              Import storyboard JSON
            </Button>
            <Button type="button" variant="outline" className="justify-start rounded-2xl bg-white/90" onClick={onLoadSample}>
              Load sample template
            </Button>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-5 text-slate-600 shadow-sm">
            Preview shows the active slide while you edit. Production Brief summarizes the handoff details for build and QA.
          </div>
        </div>
      </SectionCard>
    </>
  );
}
