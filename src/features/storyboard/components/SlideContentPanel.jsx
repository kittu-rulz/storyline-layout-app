import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CollectionEditor, SectionCard } from "@/features/storyboard/components/storyboardSidebarHelpers";
import { DynamicTemplateForm } from "@/features/storyboard/forms/DynamicTemplateForm";
import { resolveTemplateForSlide } from "@/features/storyboard/templates";
import { buildEditorConfigs } from "@/features/storyboard/utils/storyboardSidebarUtils";

export function SlideContentPanel({ currentTheme, form, formActions, fieldValidationMap }) {
  const editorConfigs = buildEditorConfigs(form, formActions);
  const selectedTemplate = resolveTemplateForSlide(form);
  const hasDynamicForm = (selectedTemplate?.formSchema?.sections?.length ?? 0) > 0;

  return (
    <SectionCard
      title="Content"
      description="Edit the learner-facing copy and any structured content blocks for the selected screen."
      action={
        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={formActions.resetToCurrentScreenDefaults}>
          Reset Screen Defaults
        </Button>
      }
      className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
    >
      {hasDynamicForm ? (
        <DynamicTemplateForm
          template={selectedTemplate}
          form={form}
          formActions={formActions}
          fieldValidationMap={fieldValidationMap}
          currentTheme={currentTheme}
        />
      ) : (
        <>
          <div className="space-y-2.5">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Title</Label>
            <Input
              className="h-11 rounded-2xl border-slate-200 bg-white/90"
              aria-invalid={fieldValidationMap?.title?.shouldShow || undefined}
              value={form.title}
              onChange={(event) => formActions.updateField("title", event.target.value)}
            />
            {fieldValidationMap?.title?.shouldShow ? (
              <p role="status" aria-live="polite" className="text-xs text-amber-700">
                {fieldValidationMap.title.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Body Copy</Label>
            <Textarea
              className="min-h-28 rounded-2xl border-slate-200 bg-white/90"
              aria-invalid={fieldValidationMap?.body?.shouldShow || undefined}
              value={form.body}
              onChange={(event) => formActions.updateField("body", event.target.value)}
            />
            {fieldValidationMap?.body?.shouldShow ? (
              <p role="status" aria-live="polite" className="text-xs text-amber-700">
                {fieldValidationMap.body.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">CTA Label</Label>
            <Input
              className="h-11 rounded-2xl border-slate-200 bg-white/90"
              aria-invalid={fieldValidationMap?.cta?.shouldShow || undefined}
              value={form.cta}
              onChange={(event) => formActions.updateField("cta", event.target.value)}
            />
            {fieldValidationMap?.cta?.shouldShow ? (
              <p role="status" aria-live="polite" className="text-xs text-amber-700">
                {fieldValidationMap.cta.message}
              </p>
            ) : null}
          </div>

          {editorConfigs.map((config) => (
            <CollectionEditor key={config.title} {...config} />
          ))}
        </>
      )}

      <div className="space-y-2.5 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
        <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Production Notes</Label>
        <Textarea
          className="min-h-24 rounded-2xl border-slate-200 bg-white/90"
          placeholder="Internal notes for the Storyline developer: states, triggers, variables, timing, accessibility, media, and QA notes."
          value={form.notes}
          onChange={(event) => formActions.updateField("notes", event.target.value)}
        />
        <p className="text-xs text-slate-500">
          These notes appear in the production brief, not in the learner-facing slide.
        </p>
      </div>
    </SectionCard>
  );
}
