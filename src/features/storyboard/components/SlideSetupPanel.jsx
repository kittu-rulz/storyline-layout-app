import { Fragment, useMemo } from "react";
import { Palette, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CUSTOM_SLIDE_SIZE_PRESET } from "@/data/slideSizes";
import { cn } from "@/lib/utils";
import { LayoutThumbnail, SectionCard } from "@/features/storyboard/components/storyboardSidebarHelpers";
import { TemplatePicker } from "@/features/storyboard/components/TemplatePicker";
import {
  buildScreenTypeGroups,
  LAYOUT_DESCRIPTIONS,
} from "@/features/storyboard/utils/storyboardSidebarUtils";
import {
  getAllTemplates,
  getDefaultTemplateId,
  getTemplatesByScreenType,
  resolveTemplateForSlide,
} from "@/features/storyboard/templates";

export function SlideSetupPanel({
  currentTheme,
  form,
  formActions,
  currentLayoutOptions,
  screenTypes,
  slideSizePresets,
  safeAreaPresets,
  themes,
  fieldValidationMap,
  isTemplatePickerOpen,
  onToggleTemplatePicker,
  onCloseTemplatePicker,
  onSelectTemplate,
}) {
  const groupedScreenTypeOptions = useMemo(() => buildScreenTypeGroups(screenTypes), [screenTypes]);
  const selectedTemplate = useMemo(() => resolveTemplateForSlide(form), [form]);
  const availableTemplates = useMemo(() => {
    const directMatches = getTemplatesByScreenType(form.screenType);

    if (directMatches.length > 1) {
      return directMatches;
    }

    const orderedTemplates = [
      ...(selectedTemplate ? [selectedTemplate] : []),
      ...getAllTemplates().filter((template) => template.id !== selectedTemplate?.id),
    ];

    return orderedTemplates;
  }, [form.screenType, selectedTemplate]);
  const templateCategoryLabel = String(selectedTemplate?.category || "general").replace(/-/g, " ");
  const isDefaultOrInferredTemplate =
    (selectedTemplate?.id || form.templateId) ===
    getDefaultTemplateId({ screenType: form.screenType, layout: form.layout });

  return (
    <>
      <SectionCard
        title="Screen Setup"
        description="Choose the screen type, layout, and template for the current slide without disrupting your draft."
        className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
      >
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Template
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              aria-expanded={isTemplatePickerOpen}
              aria-controls={`template-list-${form.id}`}
              onClick={onToggleTemplatePicker}
            >
              {isTemplatePickerOpen ? "Hide" : "Change template"}
            </Button>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              {selectedTemplate?.name || "Template pending"}
            </p>
            <p className="text-xs leading-5 text-slate-500">Category: {templateCategoryLabel}</p>
            <p className="text-xs leading-5 text-slate-500">
              {selectedTemplate?.usageHint || "Choose the structure that best matches the learning intent."}
            </p>
            {isDefaultOrInferredTemplate ? (
              <p className="text-[11px] leading-5 text-slate-500">
                You can switch templates to change structure.
              </p>
            ) : null}
          </div>

          {isTemplatePickerOpen ? (
            <TemplatePicker
              listId={`template-list-${form.id}`}
              templates={availableTemplates}
              selectedTemplateId={selectedTemplate?.id || form.templateId}
              onSelectTemplate={(templateId) => {
                onSelectTemplate?.(templateId);
                onCloseTemplatePicker?.();
              }}
              currentTheme={currentTheme}
            />
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Screen Type</Label>
          <Select value={form.screenType} onValueChange={formActions.switchScreenType}>
            <SelectTrigger
              className="h-11 rounded-2xl border-slate-200 bg-white/90"
              aria-invalid={fieldValidationMap?.screenType?.shouldShow || undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupedScreenTypeOptions.map((group, groupIndex) => (
                <Fragment key={group.category}>
                  {groupIndex > 0 ? <SelectSeparator /> : null}
                  <SelectGroup>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.items.map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </Fragment>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            Shared content is preserved so you can explore different screen types
            without losing your current draft.
          </p>
          {fieldValidationMap?.screenType?.shouldShow ? (
            <p role="status" aria-live="polite" className="text-xs text-amber-700">
              {fieldValidationMap.screenType.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Layout Style</Label>
            <span className="text-xs text-slate-500">
              {currentLayoutOptions.length} option{currentLayoutOptions.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {currentLayoutOptions.map((option) => {
              const isActive = form.layout === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => formActions.switchLayoutStyle(option.value)}
                  className={cn(
                    "space-y-3 rounded-3xl border p-3 text-left transition-all shadow-sm",
                    isActive
                      ? `${currentTheme.activeSurface} ${currentTheme.activeBorder} shadow-sm`
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <LayoutThumbnail layout={option.value} />
                  <div className="space-y-1">
                    <div className={cn("text-sm font-semibold", isActive ? currentTheme.activeText : "text-slate-900")}>
                      {option.label}
                    </div>
                    <p className="text-xs leading-5 text-slate-500">
                      {LAYOUT_DESCRIPTIONS[option.value] || "Layout option for this screen type."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {fieldValidationMap?.layout?.shouldShow ? (
            <p role="status" aria-live="polite" className="text-xs text-amber-700">
              {fieldValidationMap.layout.message}
            </p>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title="Visual Settings"
        description="Pick the theme and slide dimensions that the preview should use."
        className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
      >
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Palette className="h-4 w-4" />
            Theme
          </Label>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(themes).map(([key, value]) => {
              const isActive = form.theme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => formActions.updateField("theme", key)}
                  className={cn(
                    "rounded-3xl border p-3 text-left transition-all shadow-sm",
                    isActive
                      ? `${currentTheme.activeSurface} ${currentTheme.activeBorder}`
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <div className={cn("mb-3 h-16 rounded-2xl border", value.page, value.surfaceBorder)} />
                  <p className="text-sm font-semibold text-slate-900">{value.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <Type className="h-4 w-4" />
              Slide Size
            </Label>
            <Select value={form.slideSizePreset} onValueChange={formActions.switchSlideSizePreset}>
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white/90">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {slideSizePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.slideSizePreset === CUSTOM_SLIDE_SIZE_PRESET ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Width</Label>
                <Input
                  type="number"
                  min="1"
                  className="h-11 rounded-2xl"
                  value={form.customSlideSize.width}
                  onChange={(event) => formActions.updateCustomSlideSize("width", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Height</Label>
                <Input
                  type="number"
                  min="1"
                  className="h-11 rounded-2xl"
                  value={form.customSlideSize.height}
                  onChange={(event) => formActions.updateCustomSlideSize("height", event.target.value)}
                />
              </div>
            </div>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        title="Production Guides"
        description="Optional overlay tools for planning only. These guides are approximate and should not replace final Storyline alignment."
        className={cn(currentTheme.surfaceMuted, currentTheme.surfaceBorder)}
      >
        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Safe Area Preset</Label>
          <Select value={form.safeAreaPreset} onValueChange={formActions.applySafeAreaPreset}>
            <SelectTrigger className="h-11 rounded-2xl bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {safeAreaPresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["top", "bottom", "left", "right"].map((side) => (
            <div key={side} className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{side}</Label>
              <Input
                type="number"
                min="0"
                className="h-11 rounded-2xl bg-white"
                value={form.safeMargins[side]}
                onChange={(event) => formActions.updateSafeMargin(side, event.target.value)}
              />
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" className="w-fit rounded-xl" onClick={formActions.resetSafeMarginsToDefault}>
          Reset Safe Margins
        </Button>

        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
          {[
            {
              label: "Show guide overlay",
              description: "Displays the safe frame and approximate content zones.",
              checked: form.showSafeGrid,
              field: "showSafeGrid",
              disabled: false,
            },
            {
              label: "Annotate guide zones",
              description: "Shows approximate zone labels inside the overlay.",
              checked: form.showGridLabels,
              field: "showGridLabels",
              disabled: !form.showSafeGrid,
            },
            {
              label: "Show 50px grid",
              description: "Adds a subtle pixel grid to judge spacing and density.",
              checked: form.showPixelGrid,
              field: "showPixelGrid",
              disabled: false,
            },
            {
              label: "Show pixel rulers",
              description: "Adds top and left rulers for planning measurements.",
              checked: form.showRulers,
              field: "showRulers",
              disabled: false,
            },
          ].map((item) => (
            <div key={item.field} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs leading-5 text-slate-500">{item.description}</p>
              </div>
              <Switch
                aria-label={item.label}
                checked={item.checked}
                disabled={item.disabled}
                onCheckedChange={(checked) => formActions.updateField(item.field, checked)}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
