import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === "object" ? { ...item } : item));
  }

  if (value && typeof value === "object") {
    return { ...value };
  }

  return value;
}

function buildItemFromSchema(itemFields = [], index = 0) {
  return itemFields.reduce((nextItem, itemField) => {
    if (itemField.defaultValue !== undefined) {
      nextItem[itemField.id] = cloneValue(itemField.defaultValue);
      return nextItem;
    }

    if (itemField.type === "toggle") {
      nextItem[itemField.id] = false;
      return nextItem;
    }

    nextItem[itemField.id] = itemField.id === "title" ? `${itemField.label || "Item"} ${index + 1}` : "";
    return nextItem;
  }, {});
}

function FieldHelp({ id, children }) {
  if (!children) {
    return null;
  }

  return (
    <p id={id} className="text-xs leading-5 text-slate-500">
      {children}
    </p>
  );
}

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="status" aria-live="polite" className="text-xs text-amber-700">
      {message}
    </p>
  );
}

function BasicFieldRenderer({ field, value, onChange, validation, controlId }) {
  const helpId = field.helpText ? `${controlId}-help` : undefined;
  const errorId = validation?.shouldShow ? `${controlId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  if (field.type === "textarea") {
    return (
      <div className="space-y-2.5">
        <Label htmlFor={controlId} className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {field.label}
          {field.required ? <span aria-hidden="true"> *</span> : null}
        </Label>
        <Textarea
          id={controlId}
          className="min-h-24 rounded-2xl border-slate-200 bg-white/90"
          aria-invalid={validation?.shouldShow || undefined}
          aria-required={field.required || undefined}
          aria-describedby={describedBy}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
        <FieldHelp id={helpId}>{field.helpText}</FieldHelp>
        <FieldError id={errorId} message={validation?.shouldShow ? validation.message : null} />
      </div>
    );
  }

  if (field.type === "toggle") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 px-3 py-3">
        <div className="space-y-1">
          <Label htmlFor={controlId} className="text-sm font-medium text-slate-900">
            {field.label}
            {field.required ? <span aria-hidden="true"> *</span> : null}
          </Label>
          <FieldHelp id={`${controlId}-help`}>{field.helpText}</FieldHelp>
        </div>
        <Switch id={controlId} checked={Boolean(value)} onCheckedChange={onChange} aria-required={field.required || undefined} />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2.5">
        <Label htmlFor={controlId} className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {field.label}
          {field.required ? <span aria-hidden="true"> *</span> : null}
        </Label>
        <select
          id={controlId}
          className="flex h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          value={value ?? ""}
          aria-required={field.required || undefined}
          onChange={(event) => onChange(event.target.value)}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldHelp id={`${controlId}-help`}>{field.helpText}</FieldHelp>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <Label htmlFor={controlId} className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        {field.label}
        {field.required ? <span aria-hidden="true"> *</span> : null}
      </Label>
      <Input
        id={controlId}
        className="h-11 rounded-2xl border-slate-200 bg-white/90"
        aria-invalid={validation?.shouldShow || undefined}
        aria-required={field.required || undefined}
        aria-describedby={describedBy}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
      <FieldHelp id={helpId}>{field.helpText}</FieldHelp>
      <FieldError id={errorId} message={validation?.shouldShow ? validation.message : null} />
    </div>
  );
}

export function TemplateFieldRenderer({
  field,
  form,
  formActions,
  fieldValidationMap,
  sectionId,
  currentTheme,
}) {
  const controlId = `${sectionId}-${field.id}`;
  const validation = fieldValidationMap?.[field.id];
  const value = form[field.id] ?? field.defaultValue;

  if (field.type === "repeater") {
    const items = Array.isArray(form[field.id]) && form[field.id].length > 0
      ? form[field.id]
      : Array.isArray(field.defaultValue)
        ? field.defaultValue
        : [];
    const minItems = field.min ?? 1;
    const maxItems = field.max ?? Number.POSITIVE_INFINITY;

    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {field.label}
            </p>
            {field.helpText ? <p className="text-xs leading-5 text-slate-500">{field.helpText}</p> : null}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => formActions.addRepeaterItem(field.id, buildItemFromSchema(field.itemFields, items.length))}
            disabled={items.length >= maxItems}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            {field.addLabel || `Add ${field.itemLabel || "Item"}`}
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${field.id}-${index}`} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/75 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {field.itemLabel || field.label} {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={cn("text-red-600 hover:bg-red-50 hover:text-red-700", currentTheme?.activeText)}
                  onClick={() => formActions.removeRepeaterItem(field.id, index, minItems)}
                  disabled={items.length <= minItems}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {(field.itemFields ?? []).map((itemField) => (
                <BasicFieldRenderer
                  key={`${field.id}-${index}-${itemField.id}`}
                  field={itemField}
                  controlId={`${controlId}-${index}-${itemField.id}`}
                  value={item?.[itemField.id] ?? itemField.defaultValue ?? ""}
                  onChange={(nextValue) =>
                    formActions.updateRepeaterItem(field.id, index, itemField.id, nextValue)
                  }
                  validation={null}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <BasicFieldRenderer
      field={field}
      controlId={controlId}
      value={value ?? ""}
      onChange={(nextValue) => formActions.updateField(field.id, nextValue)}
      validation={validation}
    />
  );
}
