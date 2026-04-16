import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function handleTemplateListKeyDown(event) {
  const supportedKeys = ["ArrowDown", "ArrowUp", "Home", "End"];
  if (!supportedKeys.includes(event.key)) {
    return;
  }

  const options = Array.from(event.currentTarget.querySelectorAll('[role="option"]'));
  if (!options.length) {
    return;
  }

  event.preventDefault();

  const currentIndex = Math.max(
    0,
    options.findIndex((option) => option === document.activeElement),
  );

  let nextIndex = currentIndex;
  if (event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % options.length;
  } else if (event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + options.length) % options.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = options.length - 1;
  }

  options[nextIndex]?.focus();
}

export function TemplatePicker({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  currentTheme,
  listId,
}) {
  if (!templates?.length) {
    return (
      <p className="text-xs leading-5 text-slate-500">
        No templates are available for this slide yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-5 text-slate-600">
        Templates most relevant to this slide are listed here. Existing title, body,
        and compatible structured content stay in place when possible.
      </p>

      <div
        id={listId}
        role="listbox"
        aria-label="Storyboard templates"
        className="space-y-2"
        onKeyDown={handleTemplateListKeyDown}
      >
        {templates.map((template) => {
          const isSelected = template.id === selectedTemplateId;
          const Thumbnail = template.thumbnail;

          return (
            <button
              key={template.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={cn(
                "w-full rounded-2xl border px-3 py-3 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                isSelected
                  ? `${currentTheme.activeSurface} ${currentTheme.activeBorder} ring-1 ring-slate-300`
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
              )}
              aria-label={isSelected ? `${template.name}, selected` : template.name}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  {Thumbnail ? (
                    <div aria-hidden="true" data-slot="template-thumbnail" className="pointer-events-none">
                      <Thumbnail />
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                    <p className="text-xs leading-5 text-slate-500">{template.description}</p>
                    {template.usageHint ? (
                      <p className="text-[11px] leading-5 text-slate-500">{template.usageHint}</p>
                    ) : null}
                  </div>
                </div>
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                    <Check className="h-3.5 w-3.5" />
                    Selected
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
