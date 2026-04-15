import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_TABS = [
  { title: "Overview", content: "Introduce the key idea for this section." },
  { title: "Details", content: "Add deeper explanation and context." },
  { title: "Examples", content: "Provide practical examples for learners." },
];

function getTabItems(form) {
  if (!Array.isArray(form.tabsItems) || form.tabsItems.length === 0) {
    return FALLBACK_TABS;
  }

  return form.tabsItems.map((item, index) => ({
    title:
      typeof item?.title === "string" && item.title.length > 0
        ? item.title
        : `Tab ${index + 1}`,
    content: typeof item?.content === "string" ? item.content : "",
  }));
}

export function TabsInteractionLayoutPreview({ form, t, frameStyle }) {
  const tabsItems = getTabItems(form);
  const [activeIndex, setActiveIndex] = useState(0);
  const displayIndex = Math.min(activeIndex, Math.max(0, tabsItems.length - 1));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 flex h-full flex-col">
        <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
          Tabs Interaction
        </Badge>
        <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 mt-3 text-[15px] leading-7 ${t.textBody}`}>{form.body}</p>

        <div className="mb-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, tabsItems.length)}, minmax(0, 1fr))` }}>
          {tabsItems.map((tab, index) => {
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
          <p className={`text-sm font-semibold ${t.accentText}`}>{tabsItems[displayIndex]?.title}</p>
          <p className={`mt-3 text-sm leading-7 ${t.textBody}`}>{tabsItems[displayIndex]?.content}</p>
        </div>

        <div className="pt-5">
          <Button className={`${t.button} rounded-2xl text-white`}>{form.cta}</Button>
        </div>
      </div>
      <SafeGridOverlay form={form} />
    </div>
  );
}
