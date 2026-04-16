import { TemplateSectionRenderer } from "@/features/storyboard/forms/TemplateSectionRenderer";

export function DynamicTemplateForm({
  template,
  form,
  formActions,
  fieldValidationMap,
  currentTheme,
}) {
  const sections = template?.formSchema?.sections ?? [];

  if (!sections.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <TemplateSectionRenderer
          key={section.id}
          section={section}
          form={form}
          formActions={formActions}
          fieldValidationMap={fieldValidationMap}
          currentTheme={currentTheme}
        />
      ))}
    </div>
  );
}
