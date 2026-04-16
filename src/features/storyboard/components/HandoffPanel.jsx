import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/features/storyboard/components/storyboardSidebarHelpers";

export function HandoffPanel({ currentTheme, onOpenBrief, exportReadiness, children }) {
  return (
    <SectionCard
      title="Handoff"
      description="Open the build brief or export what you need without leaving this workspace. Use the brief as the final handoff checkpoint."
      className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
      action={
        <Button type="button" className={cn("rounded-xl text-white shadow-sm", currentTheme.button)} onClick={onOpenBrief}>
          <FileText className="mr-2 h-4 w-4" />
          Open Production Brief
        </Button>
      }
    >
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-[22px] border px-3.5 py-2.5 text-xs font-medium shadow-sm",
          exportReadiness?.valid
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-amber-200 bg-amber-50 text-amber-800",
        )}
      >
        Status: {exportReadiness?.headline}
      </div>
      {children}
    </SectionCard>
  );
}
