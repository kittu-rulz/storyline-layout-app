import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const PATTERN_LABELS = {
  "click-reveal": "Click and Reveal",
  "tabs-interaction": "Tabs",
  "process-steps": "Process Steps",
  accordion: "Accordion",
};
const FALLBACK_TABS = [
  { title: "Overview", content: "Introduce the key idea for this section." },
  { title: "Details", content: "Add deeper explanation and context." },
  { title: "Examples", content: "Provide practical examples for learners." },
];
const FALLBACK_ACCORDION_SECTIONS = [
  { title: "Section 1", content: "Primary section content for the first accordion panel." },
  { title: "Section 2", content: "Secondary section content for the next accordion panel." },
  { title: "Section 3", content: "Additional details for the final accordion panel." },
];
const FALLBACK_PROCESS_STEPS = [
  { title: "Step 1", description: "Describe the first step and expected outcome." },
  { title: "Step 2", description: "Describe the second step and transition." },
  { title: "Step 3", description: "Describe the third step and completion criteria." },
];
const FALLBACK_HOTSPOTS = [
  { title: "Hotspot 1", content: "Explain the first interface area and its function." },
  { title: "Hotspot 2", content: "Explain the second interface area and usage guidance." },
  { title: "Hotspot 3", content: "Explain the third interface area and related behavior." },
  { title: "Hotspot 4", content: "Explain the final interface area and learner action." },
];

function getItems(form, field, fallback, keyA, keyB) {
  if (!Array.isArray(form[field]) || form[field].length === 0) {
    return fallback;
  }

  return form[field].map((item, index) => ({
    [keyA]: typeof item?.[keyA] === "string" && item[keyA].length > 0 ? item[keyA] : `${keyA} ${index + 1}`,
    [keyB]: typeof item?.[keyB] === "string" ? item[keyB] : "",
  }));
}

function normalizePattern(layout) {
  return layout === "grid-hotspots" ? "click-reveal" : layout;
}

function Frame({ form, t, frameStyle, children }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 h-full">{children}</div>
      <SafeGridOverlay form={form} />
    </div>
  );
}

function Header({ form, t, pattern }) {
  return (
    <>
      <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
        {PATTERN_LABELS[pattern] || "Interaction Pattern"}
      </Badge>
      <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
      <p className={`mb-6 mt-3 text-[15px] leading-7 ${t.textBody}`}>{form.body}</p>
    </>
  );
}

export function InteractionLayoutPreview({ form, t, frameStyle }) {
  const pattern = normalizePattern(form.layout);
  const hotspots = getItems(form, "hotspotItems", FALLBACK_HOTSPOTS, "title", "content");
  const tabs = getItems(form, "tabsItems", FALLBACK_TABS, "title", "content");
  const sections = getItems(form, "accordionSections", FALLBACK_ACCORDION_SECTIONS, "title", "content");
  const steps = getItems(form, "processSteps", FALLBACK_PROCESS_STEPS, "title", "description");
  const itemCount =
    pattern === "click-reveal"
      ? hotspots.length
      : pattern === "tabs-interaction"
        ? tabs.length
        : pattern === "accordion"
          ? sections.length
          : steps.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const displayIndex = Math.min(activeIndex, Math.max(0, itemCount - 1));

  return (
    <Frame form={form} t={t} frameStyle={frameStyle}>
      <div className="flex h-full flex-col">
        <Header form={form} t={t} pattern={pattern} />

        {pattern === "click-reveal" ? (
          <>
            <div className="mb-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(2, Math.min(hotspots.length, 4))}, minmax(0, 1fr))` }}>
              {hotspots.map((hotspot, index) => {
                const isActive = index === displayIndex;
                return (
                  <button
                    key={`${hotspot.title}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-[28px] border px-4 py-6 text-left transition-all ${
                      isActive
                        ? `${t.activeSurface} ${t.activeBorder}`
                        : `${t.surfaceMuted} ${t.surfaceBorder} hover:bg-white`
                    }`}
                  >
                    <p className={`text-sm font-semibold ${isActive ? t.activeText : t.textStrong}`}>{hotspot.title}</p>
                    <p className={`mt-2 text-xs leading-5 ${t.textMuted}`}>Click to preview the reveal state.</p>
                  </button>
                );
              })}
            </div>
            <div className={`flex-1 rounded-[32px] border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`text-sm font-semibold ${t.accentText}`}>{hotspots[displayIndex]?.title}</p>
              <p className={`mt-3 text-sm leading-7 ${t.textBody}`}>{hotspots[displayIndex]?.content}</p>
            </div>
          </>
        ) : null}

        {pattern === "tabs-interaction" ? (
          <>
            <div className="mb-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, tabs.length)}, minmax(0, 1fr))` }}>
              {tabs.map((tab, index) => {
                const isActive = index === displayIndex;
                return (
                  <button
                    key={`${tab.title}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? `${t.activeSurface} ${t.activeBorder} ${t.activeText}`
                        : `${t.surfaceMuted} ${t.surfaceBorder} ${t.textMuted}`
                    }`}
                  >
                    {tab.title}
                  </button>
                );
              })}
            </div>
            <div className={`flex-1 rounded-[32px] border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`text-sm font-semibold ${t.accentText}`}>{tabs[displayIndex]?.title}</p>
              <p className={`mt-3 text-sm leading-7 ${t.textBody}`}>{tabs[displayIndex]?.content}</p>
            </div>
          </>
        ) : null}

        {pattern === "process-steps" ? (
          <>
            <div className="mb-5 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(steps.length, 4))}, minmax(0, 1fr))` }}>
              {steps.slice(0, 4).map((step, index) => {
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
              <p className={`text-sm font-semibold ${t.accentText}`}>{steps[displayIndex]?.title}</p>
              <p className={`mt-3 text-sm leading-7 ${t.textBody}`}>{steps[displayIndex]?.description}</p>
            </div>
          </>
        ) : null}

        {pattern === "accordion" ? (
          <div className="space-y-3">
            {sections.map((section, index) => {
              const isActive = index === displayIndex;
              return (
                <div key={`${section.title}-${index}`} className={`overflow-hidden rounded-[28px] border ${isActive ? `${t.activeBorder} ${t.activeSurface}` : `${t.surfaceBorder} bg-white`}`}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className={`text-sm font-semibold ${isActive ? t.activeText : t.textStrong}`}>{section.title}</span>
                    <span className={`text-xs ${t.textMuted}`}>{isActive ? "Open" : "Closed"}</span>
                  </button>
                  {isActive ? (
                    <div className={`border-t px-5 py-4 text-sm leading-7 ${t.surfaceBorder} ${t.textBody}`}>
                      {section.content}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </Frame>
  );
}
