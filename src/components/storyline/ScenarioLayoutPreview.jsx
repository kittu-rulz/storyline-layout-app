import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_SCENARIO_OPTIONS = [
  { title: "Response Path 1", detail: "Acknowledge concern and ask a clarifying question." },
  { title: "Response Path 2", detail: "Offer a direct recommendation based on known constraints." },
  { title: "Response Path 3", detail: "Escalate to a specialist with context summary." },
  { title: "Response Path 4", detail: "Document next steps and confirm follow-up timing." },
];

function getScenarioOptions(form) {
  if (!Array.isArray(form.scenarioOptions) || form.scenarioOptions.length === 0) {
    return FALLBACK_SCENARIO_OPTIONS;
  }

  return form.scenarioOptions.map((item, index) => ({
    title:
      typeof item?.title === "string" && item.title.length > 0
        ? item.title
        : `Response Path ${index + 1}`,
    detail: typeof item?.detail === "string" ? item.detail : "",
  }));
}

export function ScenarioLayoutPreview({ form, t, frameStyle }) {
  const scenarioOptions = getScenarioOptions(form);
  const [activeIndex, setActiveIndex] = useState(0);
  const displayIndex = Math.min(activeIndex, Math.max(0, scenarioOptions.length - 1));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 flex h-full flex-col">
        <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
          Scenario
        </Badge>
        <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 mt-3 text-[15px] leading-7 ${t.textBody}`}>{form.body}</p>

        {form.layout === "scenario-decision-grid" ? (
          <div className="grid flex-1 grid-cols-2 gap-3">
            {scenarioOptions.map((option, index) => {
              const isActive = index === displayIndex;
              return (
                <button
                  key={`${option.title}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-[28px] border p-4 text-left transition-all ${
                    isActive
                      ? `${t.activeSurface} ${t.activeBorder}`
                      : `${t.surfaceMuted} ${t.surfaceBorder} hover:bg-white`
                  }`}
                >
                  <p className={`text-sm font-semibold ${isActive ? t.activeText : t.textStrong}`}>{option.title}</p>
                  <p className={`mt-2 text-sm leading-6 ${t.textBody}`}>{option.detail}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <div className={`rounded-[32px] border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`text-sm font-semibold ${t.accentText}`}>Situation</p>
              <p className={`mt-2 text-sm leading-7 ${t.textBody}`}>
                A learner-facing scenario prompt appears here with context, constraints,
                and a desired outcome.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {scenarioOptions.map((option, index) => {
                const isActive = index === displayIndex;
                return (
                  <button
                    key={`${option.title}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? `${t.activeSurface} ${t.activeBorder}`
                        : `${t.surfaceMuted} ${t.surfaceBorder} hover:bg-white`
                    }`}
                  >
                    <p className={`text-sm font-semibold ${isActive ? t.activeText : t.textStrong}`}>{option.title}</p>
                  </button>
                );
              })}
            </div>
            <div className={`mt-4 flex-1 rounded-[32px] border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`text-sm font-semibold ${t.accentText}`}>Selected Outcome</p>
              <p className={`mt-3 text-sm leading-7 ${t.textBody}`}>{scenarioOptions[displayIndex]?.detail}</p>
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
