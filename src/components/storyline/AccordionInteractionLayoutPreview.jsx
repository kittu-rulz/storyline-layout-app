import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_SECTIONS = [
  { title: "Section 1", content: "Primary section content for the first accordion panel." },
  { title: "Section 2", content: "Secondary section content for the next accordion panel." },
  { title: "Section 3", content: "Additional details for the final accordion panel." },
];

function getSections(form) {
  if (!Array.isArray(form.accordionSections) || form.accordionSections.length === 0) {
    return FALLBACK_SECTIONS;
  }

  return form.accordionSections.map((item, index) => ({
    title:
      typeof item?.title === "string" && item.title.length > 0
        ? item.title
        : `Section ${index + 1}`,
    content: typeof item?.content === "string" ? item.content : "",
  }));
}

export function AccordionInteractionLayoutPreview({ form, t, frameStyle }) {
  const sections = getSections(form);
  const [activeIndex, setActiveIndex] = useState(0);
  const displayIndex = Math.min(activeIndex, Math.max(0, sections.length - 1));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 flex h-full flex-col">
        <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
          Accordion Interaction
        </Badge>
        <h2 className={`text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 mt-3 text-[15px] leading-7 ${t.textBody}`}>{form.body}</p>

        <div className="flex-1 space-y-3">
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
                    {section.content || "Add focused build notes, visuals, or narration for this section."}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="pt-5">
          <Button className={`${t.button} rounded-2xl text-white`}>{form.cta}</Button>
        </div>
      </div>
      <SafeGridOverlay form={form} />
    </div>
  );
}
