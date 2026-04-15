import { Fragment, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CircleAlert,
  Copy,
  Download,
  FileText,
  LayoutTemplate,
  Layers3,
  Palette,
  Plus,
  Presentation,
  Sparkles,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import {
  screenTypeCategoryLabels,
  screenTypeCategoryOrder,
} from "@/data/screenTypes";
import { CUSTOM_SLIDE_SIZE_PRESET } from "@/data/slideSizes";
import { validateSlideForExport } from "@/components/slideModel";
import { cn } from "@/lib/utils";

const TEXTAREA_FIELDS = new Set(["content", "detail", "description"]);
const LAYOUT_DESCRIPTIONS = {
  "hero-center": "Centered intro layout for section starts and welcome screens.",
  "text-left-image-right": "Copy-first layout with supporting media.",
  "image-left-text-right": "Media-led layout for screenshots and examples.",
  "full-width-content": "Single-column reading layout for dense explanations.",
  "image-top-text-bottom": "Hero media on top with explanation below.",
  "two-column-text": "Parallel text blocks for split concepts.",
  "objectives-list": "Outcome-focused list of learning goals.",
  "two-column-objectives": "Grouped outcomes with clearer scanning.",
  "horizontal-steps": "Equal-weight step sequence across the slide.",
  "timeline-vertical": "Stacked workflow or process walkthrough.",
  "comparison-side-by-side": "Direct side-by-side comparison.",
  "comparison-pros-cons": "Tradeoff framing for decisions.",
  "timeline-horizontal": "Milestones mapped across a horizontal flow.",
  "timeline-milestones": "Milestone-led progression with checkpoints.",
  "key-takeaways": "Recap block for essential ideas and next actions.",
  "summary-checklist": "Checklist-style confirmation summary.",
  "tabs-top-content": "Tabbed reveal for grouped content.",
  "scenario-branching": "Scenario prompt with learner response paths.",
  "scenario-decision-grid": "Visible decision grid for multiple choices.",
  "reflection-prompt": "Prompt-led reflection moment.",
  "reflection-checkpoint": "Short checkpoint before continuing.",
  "accordion-panels": "Expandable sections for progressive disclosure.",
  "accordion-steps": "Accordion structure framed as a walkthrough.",
  "click-reveal": "Hotspots that reveal contextual information.",
  "tabs-interaction": "Interactive tabs with stateful content.",
  "process-steps": "State-based step interaction with detail panel.",
  accordion: "Expandable interaction for layered information.",
  "mcq-standard": "Standard multiple-choice knowledge check.",
};

function SectionCard({ title, description, action, className, children }) {
  return (
    <section className={cn("space-y-4 rounded-[28px] border p-4 md:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold tracking-tight text-slate-950">{title}</h3>
          {description ? <p className="text-xs leading-5 text-slate-500">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function LayoutThumbnail({ layout }) {
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

function CollectionEditor({ title, description, itemLabel, items, fields, onAdd, onRemove, onChange, addLabel }) {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
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
          <div key={`${title}-${index}`} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
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

function buildScreenTypeGroups(screenTypes) {
  const entries = Object.entries(screenTypes);
  const groups = screenTypeCategoryOrder
    .map((category) => ({
      category,
      label: screenTypeCategoryLabels[category] || category,
      items: entries.filter(([, value]) => value.category === category),
    }))
    .filter((group) => group.items.length > 0);
  const groupedKeys = new Set(groups.flatMap((group) => group.items.map(([key]) => key)));
  const uncategorized = entries.filter(([key]) => !groupedKeys.has(key));

  if (uncategorized.length > 0) {
    groups.push({ category: "other", label: "Other", items: uncategorized });
  }

  return groups;
}

function createTextEditor({ title, description, itemLabel, addLabel, items, add, remove, update, placeholder }) {
  return {
    title,
    description,
    itemLabel,
    addLabel,
    items,
    fields: [{ key: "text", label: itemLabel, placeholder }],
    onAdd: add,
    onRemove: remove,
    onChange: (index, _key, value) => update(index, value),
  };
}

function createStructuredEditor({ title, description, itemLabel, addLabel, items, add, remove, update, fields }) {
  return {
    title,
    description,
    itemLabel,
    addLabel,
    items,
    fields,
    onAdd: add,
    onRemove: remove,
    onChange: (index, key, value) => update(index, key, value),
  };
}
function buildEditorConfigs(form, formActions) {
  const configs = [];

  if (form.screenType === "title") {
    configs.push(
      createTextEditor({
        title: "Title Highlights",
        description: "Supporting chips shown on the intro screen.",
        itemLabel: "Highlight",
        addLabel: "Add Highlight",
        items: Array.isArray(form.titleHighlights) ? form.titleHighlights : [],
        add: formActions.addTitleHighlight,
        remove: formActions.removeTitleHighlight,
        update: formActions.updateTitleHighlight,
        placeholder: "What learners will see",
      }),
    );
  }

  if (form.screenType === "content") {
    configs.push(
      createStructuredEditor({
        title: "Content Blocks",
        description: "Secondary structure for content-heavy layouts.",
        itemLabel: "Block",
        addLabel: "Add Block",
        items: Array.isArray(form.contentBlocks) ? form.contentBlocks : [],
        add: formActions.addContentBlock,
        remove: formActions.removeContentBlock,
        update: formActions.updateContentBlock,
        fields: [
          { key: "title", label: "Block Title", placeholder: "Core insight" },
          { key: "content", label: "Block Content", placeholder: "Supporting explanation" },
        ],
      }),
    );
  }

  if (form.screenType === "objectives") {
    configs.push(
      createTextEditor({
        title: "Objectives",
        description: "Learner outcomes shown in the objectives screen.",
        itemLabel: "Objective",
        addLabel: "Add Objective",
        items: Array.isArray(form.objectivesItems) ? form.objectivesItems : [],
        add: formActions.addObjectiveItem,
        remove: formActions.removeObjectiveItem,
        update: formActions.updateObjectiveItem,
        placeholder: "Learner will be able to...",
      }),
    );
  }

  if (form.screenType === "comparison") {
    configs.push(
      createStructuredEditor({
        title: "Comparison Rows",
        description: "Criteria and side-by-side details for compare screens.",
        itemLabel: "Row",
        addLabel: "Add Row",
        items: Array.isArray(form.comparisonRows) ? form.comparisonRows : [],
        add: formActions.addComparisonRow,
        remove: formActions.removeComparisonRow,
        update: formActions.updateComparisonRow,
        fields: [
          { key: "criterion", label: "Criteria", placeholder: "Speed" },
          { key: "left", label: "Left Side", placeholder: "Faster rollout" },
          { key: "right", label: "Right Side", placeholder: "Higher complexity" },
        ],
      }),
    );
  }

  if (form.screenType === "timeline") {
    configs.push(
      createStructuredEditor({
        title: "Timeline Events",
        description: "Chronological steps, milestones, or phases.",
        itemLabel: "Event",
        addLabel: "Add Event",
        items: Array.isArray(form.timelineEvents) ? form.timelineEvents : [],
        add: formActions.addTimelineEvent,
        remove: formActions.removeTimelineEvent,
        update: formActions.updateTimelineEvent,
        fields: [
          { key: "title", label: "Event Title", placeholder: "Kickoff" },
          { key: "detail", label: "Event Detail", placeholder: "What happens during this phase" },
        ],
      }),
    );
  }

  if (form.screenType === "summary") {
    configs.push(
      createTextEditor({
        title: "Takeaways",
        description: "End-of-section recap points shown in summary screens.",
        itemLabel: "Point",
        addLabel: "Add Point",
        items: Array.isArray(form.summaryPoints) ? form.summaryPoints : [],
        add: formActions.addSummaryPoint,
        remove: formActions.removeSummaryPoint,
        update: formActions.updateSummaryPoint,
        placeholder: "I know the next action to take",
      }),
    );
  }

  if (form.screenType === "scenario") {
    configs.push(
      createStructuredEditor({
        title: "Scenario Options",
        description: "Decision paths learners can choose from.",
        itemLabel: "Option",
        addLabel: "Add Option",
        items: Array.isArray(form.scenarioOptions) ? form.scenarioOptions : [],
        add: formActions.addScenarioOption,
        remove: formActions.removeScenarioOption,
        update: formActions.updateScenarioOption,
        fields: [
          { key: "title", label: "Option Title", placeholder: "Response Path 1" },
          { key: "detail", label: "Outcome or Detail", placeholder: "What this choice represents" },
        ],
      }),
    );
  }

  if (form.screenType === "reflection") {
    configs.push(
      createTextEditor({
        title: "Reflection Checks",
        description: "Optional prompts that anchor the reflection screen.",
        itemLabel: "Check",
        addLabel: "Add Check",
        items: Array.isArray(form.reflectionChecks) ? form.reflectionChecks : [],
        add: formActions.addReflectionCheck,
        remove: formActions.removeReflectionCheck,
        update: formActions.updateReflectionCheck,
        placeholder: "I can explain this concept in my own words.",
      }),
    );
  }

  if (form.screenType === "quiz") {
    configs.push(
      createTextEditor({
        title: "Answer Options",
        description: "Possible learner answers for the knowledge check.",
        itemLabel: "Answer",
        addLabel: "Add Answer",
        items: Array.isArray(form.quizOptions) ? form.quizOptions : [],
        add: formActions.addQuizOption,
        remove: formActions.removeQuizOption,
        update: formActions.updateQuizOption,
        placeholder: "Option 1",
      }),
    );
  }

  if (form.screenType === "tabs" || (form.screenType === "interaction" && form.layout === "tabs-interaction")) {
    configs.push(
      createStructuredEditor({
        title: "Tabs",
        description: "Labels and content revealed when each tab is selected.",
        itemLabel: "Tab",
        addLabel: "Add Tab",
        items: Array.isArray(form.tabsItems) ? form.tabsItems : [],
        add: formActions.addTabItem,
        remove: formActions.removeTabItem,
        update: formActions.updateTabItem,
        fields: [
          { key: "title", label: "Tab Label", placeholder: "Overview" },
          { key: "content", label: "Tab Content", placeholder: "What appears when this tab is active" },
        ],
      }),
    );
  }

  if (form.screenType === "accordionInteraction" || (form.screenType === "interaction" && form.layout === "accordion")) {
    configs.push(
      createStructuredEditor({
        title: "Accordion Sections",
        description: "Expandable sections and their revealed content.",
        itemLabel: "Section",
        addLabel: "Add Section",
        items: Array.isArray(form.accordionSections) ? form.accordionSections : [],
        add: formActions.addAccordionSection,
        remove: formActions.removeAccordionSection,
        update: formActions.updateAccordionSection,
        fields: [
          { key: "title", label: "Section Title", placeholder: "Section 1" },
          { key: "content", label: "Section Content", placeholder: "What learners see when this panel expands" },
        ],
      }),
    );
  }

  if (form.screenType === "process" || (form.screenType === "interaction" && form.layout === "process-steps")) {
    configs.push(
      createStructuredEditor({
        title: "Process Steps",
        description: "Sequential stages and their descriptions.",
        itemLabel: "Step",
        addLabel: "Add Step",
        items: Array.isArray(form.processSteps) ? form.processSteps : [],
        add: formActions.addProcessStep,
        remove: formActions.removeProcessStep,
        update: formActions.updateProcessStep,
        fields: [
          { key: "title", label: "Step Title", placeholder: "Receive Request" },
          { key: "description", label: "Step Description", placeholder: "Describe what happens at this step" },
        ],
      }),
    );
  }

  if (form.screenType === "interaction" && form.layout === "click-reveal") {
    configs.push(
      createStructuredEditor({
        title: "Hotspots",
        description: "Clickable hotspots and the information each reveals.",
        itemLabel: "Hotspot",
        addLabel: "Add Hotspot",
        items: Array.isArray(form.hotspotItems) ? form.hotspotItems : [],
        add: formActions.addHotspotItem,
        remove: formActions.removeHotspotItem,
        update: formActions.updateHotspotItem,
        fields: [
          { key: "title", label: "Hotspot Label", placeholder: "Hotspot 1" },
          { key: "content", label: "Reveal Content", placeholder: "What appears after the learner clicks this hotspot" },
        ],
      }),
    );
  }

  return configs;
}
export function StoryboardSidebar({
  form,
  formActions,
  saveStatus,
  slides,
  activeSlideId,
  onSelectSlide,
  onCreateSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlideUp,
  onMoveSlideDown,
  layoutOptionsMap,
  currentLayoutOptions,
  slideSizePresets,
  safeAreaPresets,
  screenTypes,
  themes,
  onOpenBrief,
  onExportSpec,
  onExportBrief,
  onExportCurrentPptx,
  onExportPptx,
  onImportStoryboardJson,
  importError,
  workspaceTab,
}) {
  const importInputRef = useRef(null);
  const currentTheme = themes[form.theme] ?? themes.corporate;
  const groupedScreenTypeOptions = useMemo(() => buildScreenTypeGroups(screenTypes), [screenTypes]);
  const editorConfigs = useMemo(() => buildEditorConfigs(form, formActions), [form, formActions]);
  const activeSlideIndex = slides.findIndex((slide) => slide.id === activeSlideId);
  const exportValidation = useMemo(() => validateSlideForExport(form), [form]);
  const workflowSteps = useMemo(
    () => [
      {
        label: "Structure selected",
        description: "Choose a screen type and matching layout.",
        done: Boolean(form.screenType && form.layout),
      },
      {
        label: "Core copy added",
        description: "Add the title, body copy, and CTA text.",
        done:
          form.title.trim().length > 0 &&
          form.body.trim().length > 0 &&
          form.cta.trim().length > 0,
      },
      {
        label: "Handoff reviewed",
        description: "Open the brief and confirm the slide is ready.",
        done: workspaceTab === "spec" || exportValidation.valid,
      },
    ],
    [exportValidation.valid, form.body, form.cta, form.layout, form.screenType, form.title, workspaceTab],
  );
  const completedWorkflowSteps = workflowSteps.filter((step) => step.done).length;

  const getSlideLayoutLabel = (slide) => {
    const options = layoutOptionsMap?.[slide.screenType] || [];
    return options.find((option) => option.value === slide.layout)?.label || slide.layout;
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportStoryboardJson(file);
    }
    event.target.value = "";
  };

  return (
    <Card
      className={cn(
        "w-full rounded-[34px] border shadow-sm backdrop-blur-sm lg:flex lg:h-full lg:flex-col lg:overflow-hidden",
        currentTheme.shell,
        currentTheme.shellBorder,
      )}
    >
      <CardHeader className={cn("border-b pb-5", currentTheme.shellBorder)}>
        <CardTitle className="flex items-start gap-3">
          <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", currentTheme.accentSoft)}>
            <LayoutTemplate className={cn("size-5", currentTheme.accentText)} />
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="text-xl font-semibold tracking-tight text-slate-950">Storyboard Workspace</div>
              <p className="text-sm leading-6 text-slate-600">
                Plan Storyline screens with cleaner structure, clearer layout choices,
                and handoff-ready output.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                  currentTheme.accentSoft,
                  currentTheme.accentBorder,
                  currentTheme.accentText,
                )}
              >
                {workspaceTab === "spec" ? "Production brief open" : "Preview editing"}
              </span>
              <span className="text-xs text-slate-500">
                Screen type changes keep your current copy when possible.
              </span>
              <span
                role="status"
                aria-live="polite"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600"
              >
                {saveStatus}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-3">
        <SectionCard
          title="Workflow Status"
          description="Follow the authoring flow and see whether the active slide is ready for handoff."
          className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Active slide
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                Slide {activeSlideIndex + 1} of {slides.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {screenTypes[form.screenType]?.name || form.screenType}
              </p>
            </div>

            <div
              className={cn(
                "rounded-2xl border p-3",
                exportValidation.valid
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50",
              )}
            >
              <div className="flex items-center gap-2">
                {exportValidation.valid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <CircleAlert className="h-4 w-4 text-amber-600" />
                )}
                <p className="text-sm font-semibold text-slate-900">
                  {exportValidation.valid ? "Ready for handoff" : "Needs review"}
                </p>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {exportValidation.valid
                  ? "The current slide has the core content needed for preview and export."
                  : exportValidation.issues.slice(0, 2).join(" ")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Progress
              </p>
              <p className="text-xs text-slate-500">{completedWorkflowSteps}/3 complete</p>
            </div>

            <div className="space-y-2">
              {workflowSteps.map((step) => (
                <div
                  key={step.label}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-3",
                    step.done ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white",
                  )}
                >
                  <div className="mt-0.5">
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{step.label}</p>
                    <p className="text-xs leading-5 text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onCreateSlide}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Slide
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => onDuplicateSlide(activeSlideId)}
            >
              <Copy className="mr-1 h-3.5 w-3.5" />
              Duplicate Active
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onOpenBrief}>
              <FileText className="mr-1 h-3.5 w-3.5" />
              Review Brief
            </Button>
          </div>
        </SectionCard>

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
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50/80 px-3 py-2">
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
                const layoutLabel = getSlideLayoutLabel(slide);

                return (
                  <div
                    key={slide.id}
                    className={cn(
                      "rounded-2xl border p-3 transition-colors",
                      isActive
                        ? `${currentTheme.activeSurface} ${currentTheme.activeBorder}`
                        : "border-slate-200 bg-white hover:bg-slate-50",
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
                        <span className="max-w-[9rem] truncate rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
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

        <SectionCard
          title="Screen Setup"
          description="Choose the screen type first, then pick a layout using the same visual pattern picker across the app."
          className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
        >
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Screen Type</Label>
            <Select value={form.screenType} onValueChange={formActions.switchScreenType}>
              <SelectTrigger className="h-11 rounded-2xl bg-white">
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
                      "space-y-3 rounded-3xl border p-3 text-left transition-all",
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
          </div>
        </SectionCard>

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
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Title</Label>
            <Input className="h-11 rounded-2xl" value={form.title} onChange={(event) => formActions.updateField("title", event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Body Copy</Label>
            <Textarea className="min-h-28 rounded-2xl" value={form.body} onChange={(event) => formActions.updateField("body", event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">CTA Label</Label>
            <Input className="h-11 rounded-2xl" value={form.cta} onChange={(event) => formActions.updateField("cta", event.target.value)} />
          </div>

          {editorConfigs.map((config) => (
            <CollectionEditor key={config.title} {...config} />
          ))}

          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Production Notes</Label>
            <Textarea
              className="min-h-24 rounded-2xl"
              placeholder="Internal notes for the Storyline developer: states, triggers, variables, timing, accessibility, media, and QA notes."
              value={form.notes}
              onChange={(event) => formActions.updateField("notes", event.target.value)}
            />
            <p className="text-xs text-slate-500">
              These notes appear in the production brief, not in the learner-facing slide.
            </p>
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
                      "rounded-3xl border p-3 text-left transition-all",
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
                <SelectTrigger className="h-11 rounded-2xl bg-white">
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
              <div key={item.field} className="flex items-center justify-between gap-4">
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

        <SectionCard
          title="Handoff"
          description="Open the build brief or export what you need without leaving this workspace. Use the brief as the final handoff checkpoint."
          className={cn(currentTheme.surface, currentTheme.surfaceBorder)}
          action={
            <Button type="button" className={cn("rounded-xl text-white", currentTheme.button)} onClick={onOpenBrief}>
              <FileText className="mr-2 h-4 w-4" />
              Open Production Brief
            </Button>
          }
        >
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFileChange}
          />

          <div className="grid gap-2 md:grid-cols-2">
            <Button type="button" variant="outline" className="justify-start rounded-2xl" onClick={onExportSpec}>
              <Download className="mr-2 h-4 w-4" />
              Export Spec JSON
            </Button>
            <Button type="button" variant="outline" className="justify-start rounded-2xl" onClick={onExportBrief}>
              <FileText className="mr-2 h-4 w-4" />
              Export Brief TXT
            </Button>
            <Button type="button" variant="outline" className="justify-start rounded-2xl" onClick={onExportCurrentPptx}>
              <Presentation className="mr-2 h-4 w-4" />
              Export Current Slide PPTX
            </Button>
            <Button type="button" variant="outline" className="justify-start rounded-2xl" onClick={onExportPptx}>
              <Presentation className="mr-2 h-4 w-4" />
              Export Storyboard PPTX
            </Button>
            <Button type="button" variant="outline" className="justify-start rounded-2xl md:col-span-2" onClick={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              Import Storyboard JSON
            </Button>
          </div>

          {importError ? (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {importError}
            </div>
          ) : null}
        </SectionCard>
      </CardContent>
    </Card>
  );
}
