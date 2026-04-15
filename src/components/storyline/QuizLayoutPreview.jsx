import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_QUIZ_OPTIONS = ["Option 1", "Option 2", "Option 3", "Option 4"];

function getQuizOptions(form) {
  if (!Array.isArray(form.quizOptions) || form.quizOptions.length === 0) {
    return FALLBACK_QUIZ_OPTIONS;
  }

  return form.quizOptions.map((item, index) =>
    typeof item?.text === "string" && item.text.length > 0
      ? item.text
      : `Option ${index + 1}`,
  );
}

export function QuizLayoutPreview({ form, t, frameStyle }) {
  const quizOptions = getQuizOptions(form);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayIndex = Math.min(selectedIndex, Math.max(0, quizOptions.length - 1));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
      style={frameStyle}
    >
      <div className="relative z-10">
        <Badge className={`mb-4 border-0 ${t.accentSoft} ${t.accentText}`}>
          Knowledge Check
        </Badge>
        <h2 className={`mb-3 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-6 ${t.textBody}`}>{form.body}</p>
        <div className="mb-6 space-y-3">
          {quizOptions.map((option, index) => {
            const isActive = index === displayIndex;
            return (
              <button
                key={`${option}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  isActive
                    ? `${t.activeSurface} ${t.activeBorder}`
                    : `${t.surfaceMuted} ${t.surfaceBorder} hover:bg-white`
                }`}
              >
                <div className={`h-4 w-4 rounded-full border ${isActive ? t.accentBorder : t.surfaceBorder} ${isActive ? t.accentSoft : "bg-white"}`} />
                <span className={isActive ? t.activeText : t.textStrong}>{option || `Option ${index + 1}`}</span>
              </button>
            );
          })}
        </div>
        <Button className={`${t.button} rounded-2xl text-white`}>{form.cta}</Button>
      </div>
      <SafeGridOverlay form={form} />
    </div>
  );
}
