import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

function getTitleHighlights(form) {
  if (!Array.isArray(form.titleHighlights) || form.titleHighlights.length === 0) {
    return [];
  }

  return form.titleHighlights
    .map((item, index) => ({
      text:
        typeof item?.text === "string" && item.text.length > 0
          ? item.text
          : `Highlight ${index + 1}`,
    }))
    .slice(0, 4);
}

export function TitleLayoutPreview({ form, t, frameStyle }) {
  const highlights = getTitleHighlights(form);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className={`h-4 ${t.accent}`} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 p-10 text-center">
        <Badge className={`border-0 ${t.accentSoft} ${t.accentText}`}>
          Section Intro
        </Badge>
        <h2 className={`max-w-3xl text-4xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`max-w-2xl text-lg leading-relaxed ${t.textBody}`}>{form.body}</p>
        {highlights.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {highlights.map((item, index) => (
              <span
                key={`${item.text}-${index}`}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${t.surfaceBorder} ${t.accentSoft} ${t.accentText}`}
              >
                {item.text}
              </span>
            ))}
          </div>
        ) : null}
        <Button className={`${t.button} rounded-2xl px-6 text-white`}>{form.cta}</Button>
      </div>
      <SafeGridOverlay form={form} />
    </div>
  );
}
