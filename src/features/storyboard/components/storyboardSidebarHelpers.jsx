import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layers3, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TEXTAREA_FIELDS = new Set(["content", "detail", "description"]);

export function SectionCard({ title, description, action, className, children }) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-[28px] border px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:px-5 md:py-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-3.5">
        <div className="space-y-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-950">{title}</h3>
          {description ? (
            <p className="max-w-[34rem] text-xs leading-5 text-slate-500">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function LayoutThumbnail({ layout }) {
  if (["hero-center"].includes(layout)) {
    return (
      <div className="flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="h-2 w-20 rounded-full bg-slate-300" />
        <div className="h-2 w-28 rounded-full bg-slate-200" />
        <div className="h-2 w-16 rounded-full bg-slate-200" />
      </div>
    );
  }

  if (["text-left-image-right", "image-left-text-right"].includes(layout)) {
    const textFirst = layout === "text-left-image-right";
    return (
      <div className="grid h-20 grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2.5">
        {textFirst ? (
          <>
            <div className="space-y-1.5 rounded-xl bg-slate-50 p-2">
              <div className="h-2 w-4/5 rounded-full bg-slate-300" />
              <div className="h-2 w-full rounded-full bg-slate-200" />
              <div className="h-2 w-3/5 rounded-full bg-slate-200" />
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100" />
          </>
        ) : (
          <>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100" />
            <div className="space-y-1.5 rounded-xl bg-slate-50 p-2">
              <div className="h-2 w-4/5 rounded-full bg-slate-300" />
              <div className="h-2 w-full rounded-full bg-slate-200" />
              <div className="h-2 w-3/5 rounded-full bg-slate-200" />
            </div>
          </>
        )}
      </div>
    );
  }

  if (["full-width-content", "reflection-prompt", "reflection-checkpoint"].includes(layout)) {
    return (
      <div className="h-20 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex h-full items-center justify-center rounded-xl bg-slate-50">
          <div className="space-y-1.5">
            <div className="mx-auto h-2 w-24 rounded-full bg-slate-300" />
            <div className="mx-auto h-2 w-20 rounded-full bg-slate-200" />
            <div className="mx-auto h-2 w-28 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (["image-top-text-bottom"].includes(layout)) {
    return (
      <div className="h-20 rounded-2xl border border-slate-200 bg-white p-2.5">
        <div className="mb-2 h-8 rounded-xl border border-dashed border-slate-300 bg-slate-100" />
        <div className="space-y-1.5 rounded-xl bg-slate-50 p-2">
          <div className="h-2 w-2/3 rounded-full bg-slate-300" />
          <div className="h-2 w-4/5 rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  if (["two-column-text", "two-column-objectives", "comparison-side-by-side", "comparison-pros-cons"].includes(layout)) {
    return (
      <div className="grid h-20 grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2.5">
        {[0, 1].map((column) => (
          <div key={column} className="space-y-1.5 rounded-xl bg-slate-50 p-2">
            <div className="h-2 w-4/5 rounded-full bg-slate-300" />
            <div className="h-2 w-full rounded-full bg-slate-200" />
            <div className="h-2 w-3/4 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (["objectives-list", "key-takeaways", "summary-checklist", "mcq-standard"].includes(layout)) {
    return (
      <div className="h-20 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="space-y-2 rounded-xl bg-slate-50 p-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-slate-300" />
              <div className="h-2 flex-1 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (["horizontal-steps", "timeline-horizontal", "timeline-milestones", "process-steps"].includes(layout)) {
    return (
      <div className="grid h-20 grid-cols-4 gap-2 rounded-2xl border border-slate-200 bg-white p-2.5">
        {[0, 1, 2, 3].map((step) => (
          <div key={step} className="rounded-xl bg-slate-50 p-2">
            <div className="mb-2 size-3 rounded-full bg-slate-300" />
            <div className="h-2 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (["timeline-vertical", "accordion", "accordion-panels", "accordion-steps"].includes(layout)) {
    return (
      <div className="h-20 rounded-2xl border border-slate-200 bg-white p-2.5">
        <div className="space-y-2">
          <div className="h-5 rounded-xl bg-slate-200" />
          <div className="h-5 rounded-xl bg-slate-100" />
          <div className="h-5 rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (["tabs-top-content", "tabs-interaction"].includes(layout)) {
    return (
      <div className="h-20 rounded-2xl border border-slate-200 bg-white p-2.5">
        <div className="mb-2 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((tab) => (
            <div key={tab} className="h-3 rounded-full bg-slate-200" />
          ))}
        </div>
        <div className="h-10 rounded-xl bg-slate-50" />
      </div>
    );
  }

  if (["click-reveal", "scenario-branching", "scenario-decision-grid"].includes(layout)) {
    return (
      <div className="grid h-20 grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2.5">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-xl bg-slate-50" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-20 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <Layers3 className="size-5 text-slate-400" />
    </div>
  );
}

export function CollectionEditor({ title, description, itemLabel, items, fields, onAdd, onRemove, onChange, addLabel }) {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200/90 bg-slate-50/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          {description ? <p className="text-xs leading-5 text-slate-500">{description}</p> : null}
        </div>
        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onAdd}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {itemLabel} {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onRemove(index)}
                disabled={items.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {fields.map((field) => {
              const Component = TEXTAREA_FIELDS.has(field.key) ? Textarea : Input;
              return (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{field.label}</Label>
                  <Component
                    className={TEXTAREA_FIELDS.has(field.key) ? "min-h-24 rounded-2xl" : "h-10 rounded-2xl"}
                    placeholder={field.placeholder}
                    value={item[field.key] ?? ""}
                    onChange={(event) => onChange(index, field.key, event.target.value)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

