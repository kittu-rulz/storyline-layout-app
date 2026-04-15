import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_REFLECTION_CHECKS = [
  "I can explain the concept in my own words.",
  "I know where to apply it in real work.",
  "I can identify next steps confidently.",
];

function getReflectionChecks(form) {
  if (!Array.isArray(form.reflectionChecks) || form.reflectionChecks.length === 0) {
    return FALLBACK_REFLECTION_CHECKS;
  }

  return form.reflectionChecks.map((item, index) =>
    typeof item?.text === "string" && item.text.length > 0
      ? item.text
      : `Check ${index + 1}`,
  );
}

export function ReflectionLayoutPreview({ form, t, frameStyle }) {
  const reflectionChecks = getReflectionChecks(form);

  if (form.layout === "reflection-checkpoint") {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
        style={frameStyle}
      >
        <div className="relative z-10 flex h-full flex-col">
          <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
            Reflection
          </Badge>
          <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
          <p className={`mb-5 ${t.textBody}`}>{form.body}</p>

          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className={`rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`mb-3 text-sm font-semibold ${t.accentText}`}>Quick Self-Check</p>
              <ul className={`space-y-2 text-sm ${t.textBody}`}>
                {reflectionChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`mb-3 text-sm font-semibold ${t.accentText}`}>Action Note</p>
              <div className={`h-28 rounded-xl border px-3 py-2 text-xs ${t.surfaceRaised} ${t.surfaceBorder} ${t.textMuted}`}>
                Add learner reflection response area.
              </div>
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
          Reflection
        </Badge>
        <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 ${t.textBody}`}>{form.body}</p>

        <div className={`flex-1 rounded-3xl border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
          <p className={`mb-3 text-sm font-semibold ${t.accentText}`}>Reflection Prompt</p>
          <p className={`mb-4 text-sm leading-6 ${t.textBody}`}>
            What is one change you will make after this lesson? What support do
            you need to apply it successfully?
          </p>
          <div className={`h-32 rounded-xl border px-3 py-2 text-xs ${t.surfaceRaised} ${t.surfaceBorder} ${t.textMuted}`}>
            Learner response text area.
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
