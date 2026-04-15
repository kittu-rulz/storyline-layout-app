import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";
import { CheckCircle2 } from "lucide-react";

const FALLBACK_SUMMARY_POINTS = [
  "I can explain the main concept in simple terms.",
  "I know the sequence of key steps.",
  "I can apply the method to a realistic case.",
  "I understand what to do next.",
];

function getSummaryPoints(form) {
  if (!Array.isArray(form.summaryPoints) || form.summaryPoints.length === 0) {
    return FALLBACK_SUMMARY_POINTS;
  }

  return form.summaryPoints.map((item, index) =>
    typeof item?.text === "string" && item.text.length > 0
      ? item.text
      : `Point ${index + 1}`,
  );
}

export function SummaryLayoutPreview({ form, t, frameStyle }) {
  const summaryPoints = getSummaryPoints(form);

  if (form.layout === "summary-checklist") {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
        style={frameStyle}
      >
        <div className="relative z-10 flex h-full flex-col">
          <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
            Summary
          </Badge>
          <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
          <p className={`mb-5 ${t.textBody}`}>{form.body}</p>
          <div className={`flex-1 rounded-3xl border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
            <div className="space-y-3">
              {summaryPoints.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className={`mt-1 h-4 w-4 ${t.accentText}`} />
                  <span className={t.textStrong}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-5">
            <Button className={`${t.button} rounded-2xl text-white`}>{form.cta}</Button>
          </div>
        </div>
        <SafeGridOverlay form={form} />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 flex h-full flex-col">
        <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
          Summary
        </Badge>
        <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 ${t.textBody}`}>{form.body}</p>
        <div className="grid flex-1 grid-cols-3 gap-4">
          {summaryPoints.slice(0, 3).map((item, index) => (
            <div key={`${item}-${index}`} className={`rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`mb-2 text-sm font-medium ${t.accentText}`}>Takeaway {index + 1}</p>
              <p className={`text-sm leading-6 ${t.textBody}`}>{item}</p>
            </div>
          ))}
        </div>
        <div className="pt-5">
          <Button className={`${t.button} rounded-2xl text-white`}>{form.cta}</Button>
        </div>
      </div>
      <SafeGridOverlay form={form} />
    </div>
  );
}
