import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SCREENS_WITH_INTERACTION_TYPE = new Set([
  "interaction",
  "tabs",
  "scenario",
  "accordionInteraction",
  "quiz",
]);

function BriefSection({ title, children, className, titleClassName }) {
  return (
    <section className={cn("rounded-[28px] border border-slate-200 bg-white p-5", className)}>
      <h4 className={cn("mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-500", titleClassName)}>
        {title}
      </h4>
      {children}
    </section>
  );
}

function BulletList({ items, emptyLabel = "No notes available." }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-slate-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-slate-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SetupItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}

export function ProductionBrief({ spec }) {
  const designerNotesText = spec.designerNotes?.trim();
  const showInteractionType = SCREENS_WITH_INTERACTION_TYPE.has(spec.screenTypeKey);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            Storyline Production Brief
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Build-ready handoff for Storyline development, including structure,
            content, safe margins, and production notes.
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          {spec.screenType}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BriefSection title="Screen Setup">
          <div className="grid gap-3 sm:grid-cols-2">
            <SetupItem label="Screen Type" value={spec.screenType} />
            <SetupItem label="Layout Style" value={spec.layoutStyle} />
            <SetupItem label="Slide Size" value={spec.slideSize} />
            <SetupItem label="Theme" value={spec.theme} />
          </div>
        </BriefSection>

        <BriefSection title="Safe Margins">
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-800">
            <SetupItem label="Top" value={`${spec.safeMargins.top}px`} />
            <SetupItem label="Bottom" value={`${spec.safeMargins.bottom}px`} />
            <SetupItem label="Left" value={`${spec.safeMargins.left}px`} />
            <SetupItem label="Right" value={`${spec.safeMargins.right}px`} />
          </div>
        </BriefSection>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BriefSection title="Objects on Slide">
          <BulletList items={spec.objectList} />
        </BriefSection>

        <BriefSection title={showInteractionType ? "Interaction Type and Notes" : "Interaction Notes"}>
          {showInteractionType ? (
            <p className="mb-3 text-sm text-slate-800">
              <span className="font-medium text-slate-900">Interaction Type:</span>{" "}
              {spec.layoutStyle}
            </p>
          ) : null}
          <p className="mb-4 text-sm leading-6 text-slate-800">{spec.structure}</p>
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Build Flow
          </div>
          <BulletList items={spec.interactionStructure} />
        </BriefSection>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BriefSection title="Content">
          <div className="space-y-3 text-sm leading-6 text-slate-800">
            <p>
              <span className="font-medium text-slate-900">Title:</span> {spec.content.title}
            </p>
            <p>
              <span className="font-medium text-slate-900">Body:</span> {spec.content.body}
            </p>
            <p>
              <span className="font-medium text-slate-900">CTA:</span> {spec.content.cta}
            </p>
            {Array.isArray(spec.content.dynamicItems) && spec.content.dynamicItems.length > 0 ? (
              <div className="pt-1">
                <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Dynamic Items
                </div>
                <BulletList items={spec.content.dynamicItems} />
              </div>
            ) : null}
          </div>
        </BriefSection>

        <BriefSection title="Suggested Animation and Build Notes">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Build Zones
          </div>
          <div className="mb-4">
            <BulletList items={spec.zones} />
          </div>
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Animation Notes
          </div>
          <BulletList items={spec.suggestedAnimationNotes} />
        </BriefSection>
      </div>

      <BriefSection title="Production Notes" className="border-amber-200 bg-amber-50/70" titleClassName="text-amber-700">
        <div className={cn("whitespace-pre-wrap text-sm leading-6", designerNotesText ? "text-amber-950" : "italic text-amber-700")}>
          {designerNotesText || "Add internal production notes for states, triggers, variables, timing, accessibility, and QA."}
        </div>
      </BriefSection>
    </div>
  );
}
