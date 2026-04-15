import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_STEPS = [
  { title: "Receive Request", description: "Add short guidance for this step in the workflow." },
  { title: "Validate Details", description: "Add short guidance for this step in the workflow." },
  { title: "Execute Task", description: "Add short guidance for this step in the workflow." },
  { title: "Confirm Completion", description: "Add short guidance for this step in the workflow." },
];

function getProcessSteps(form) {
  if (!Array.isArray(form.processSteps) || form.processSteps.length === 0) {
    return FALLBACK_STEPS;
  }

  return form.processSteps.map((item, index) => ({
    title:
      typeof item?.title === "string" && item.title.length > 0
        ? item.title
        : `Step ${index + 1}`,
    description: typeof item?.description === "string" ? item.description : "",
  }));
}

export function ProcessLayoutPreview({ form, t, frameStyle }) {
  const processSteps = getProcessSteps(form);
  const [activeIndex, setActiveIndex] = useState(0);
  const displayIndex = Math.min(activeIndex, Math.max(0, processSteps.length - 1));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 flex h-full flex-col">
        <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
          Process
        </Badge>
        <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 mt-3 text-[15px] leading-7 ${t.textBody}`}>{form.body}</p>

        {form.layout === "timeline-vertical" ? (
          <div className={`flex-1 rounded-[32px] border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
            <div className="space-y-4">
              {processSteps.map((step, index) => {
                const isActive = index === displayIndex;
                return (
                  <button key={`${step.title}-${index}`} type="button" onClick={() => setActiveIndex(index)} className="flex w-full items-start gap-3 text-left">
                    <div className={`mt-0.5 flex size-8 items-center justify-center rounded-full ${isActive ? t.accent : "bg-slate-300"} text-xs font-semibold text-white`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-semibold ${isActive ? t.accentText : t.textStrong}`}>{step.title}</p>
                      <p className={`mt-1 text-sm leading-6 ${t.textBody}`}>{step.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(processSteps.length, 4))}, minmax(0, 1fr))` }}>
              {processSteps.slice(0, 4).map((step, index) => {
                const isActive = index === displayIndex;
                return (
                  <button
                    key={`${step.title}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-[28px] border p-4 text-left transition-all ${
                      isActive
                        ? `${t.activeSurface} ${t.activeBorder}`
                        : `${t.surfaceMuted} ${t.surfaceBorder} hover:bg-white`
                    }`}
                  >
                    <div className={`mb-3 flex size-7 items-center justify-center rounded-full ${t.accent} text-xs font-semibold text-white`}>
                      {index + 1}
                    </div>
                    <p className={`text-sm font-semibold ${isActive ? t.activeText : t.textStrong}`}>{step.title}</p>
                  </button>
                );
              })}
            </div>
            <div className={`flex-1 rounded-[32px] border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`text-sm font-semibold ${t.accentText}`}>{processSteps[displayIndex]?.title}</p>
              <p className={`mt-3 text-sm leading-7 ${t.textBody}`}>{processSteps[displayIndex]?.description}</p>
            </div>
          </>
        )}

        <div className="pt-5">
          <Button className={`${t.button} rounded-2xl text-white`}>{form.cta}</Button>
        </div>
      </div>
      <SafeGridOverlay form={form} />
    </div>
  );
}
