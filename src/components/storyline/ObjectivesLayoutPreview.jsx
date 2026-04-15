import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";
import { CheckCircle2, Target } from "lucide-react";

const FALLBACK_OBJECTIVES = [
  "Define the key principle and when it applies.",
  "Identify common mistakes and how to avoid them.",
  "Use the process in a practical scenario.",
  "Evaluate outcomes and improve next steps.",
];

function getObjectives(form) {
  if (!Array.isArray(form.objectivesItems) || form.objectivesItems.length === 0) {
    return FALLBACK_OBJECTIVES;
  }

  return form.objectivesItems.map((item, index) =>
    typeof item?.text === "string" && item.text.length > 0
      ? item.text
      : `Objective ${index + 1}`,
  );
}

export function ObjectivesLayoutPreview({ form, t, frameStyle }) {
  const objectives = getObjectives(form);

  if (form.layout === "two-column-objectives") {
    const firstColumn = objectives.filter((_, index) => index % 2 === 0);
    const secondColumn = objectives.filter((_, index) => index % 2 === 1);

    return (
      <div
        className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
        style={frameStyle}
      >
        <div className="relative z-10 flex h-full flex-col">
          <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
            Learning Goals
          </Badge>
          <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
          <p className={`mb-5 ${t.textBody}`}>{form.body}</p>
          <div className="grid flex-1 grid-cols-2 gap-4">
            {[firstColumn, secondColumn].map((columnItems, columnIndex) => (
              <div
                key={`objective-column-${columnIndex + 1}`}
                className={`rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Target className={`h-4 w-4 ${t.accentText}`} />
                  <p className={`font-medium ${t.accentText}`}>Objective Group {columnIndex + 1}</p>
                </div>
                <ul className={`space-y-2 text-sm ${t.textBody}`}>
                  {columnItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 ${t.accentText}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10 flex h-full flex-col">
        <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
          Learning Goals
        </Badge>
        <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 ${t.textBody}`}>{form.body}</p>
        <div className={`flex-1 rounded-3xl border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
          <ul className={`space-y-3 ${t.textStrong}`}>
            {objectives.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className={`mt-1 h-4 w-4 ${t.accentText}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-5">
          <Button className={`${t.button} rounded-2xl text-white`}>{form.cta}</Button>
        </div>
      </div>
      <SafeGridOverlay form={form} />
    </div>
  );
}
