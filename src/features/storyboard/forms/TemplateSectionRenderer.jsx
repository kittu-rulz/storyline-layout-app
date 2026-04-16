import { TemplateFieldRenderer } from "@/features/storyboard/forms/TemplateFieldRenderer";

export function TemplateSectionRenderer({
  section,
  form,
  formActions,
  fieldValidationMap,
  currentTheme,
}) {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200/90 bg-slate-50/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-900">{section.title}</h4>
        {section.description ? (
          <p className="text-xs leading-5 text-slate-500">{section.description}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        {(section.fields ?? []).map((field) => (
          <TemplateFieldRenderer
            key={`${section.id}-${field.id}`}
            field={field}
            form={form}
            formActions={formActions}
            fieldValidationMap={fieldValidationMap}
            sectionId={section.id}
            currentTheme={currentTheme}
          />
        ))}
      </div>
    </div>
  );
}
