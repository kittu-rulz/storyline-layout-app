import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_COMPARISON_ROWS = [
  ["Speed", "Faster rollout", "Moderate rollout"],
  ["Complexity", "Lower complexity", "Higher complexity"],
  ["Best Use", "Quick wins", "Deep capability"],
];

function getComparisonRows(form) {
  if (!Array.isArray(form.comparisonRows) || form.comparisonRows.length === 0) {
    return FALLBACK_COMPARISON_ROWS.map(([criterion, left, right]) => ({
      criterion,
      left,
      right,
    }));
  }

  return form.comparisonRows.map((item, index) => ({
    criterion:
      typeof item?.criterion === "string" && item.criterion.length > 0
        ? item.criterion
        : `Criteria ${index + 1}`,
    left: typeof item?.left === "string" ? item.left : "",
    right: typeof item?.right === "string" ? item.right : "",
  }));
}

export function ComparisonLayoutPreview({ form, t, frameStyle }) {
  const comparisonRows = getComparisonRows(form);

  if (form.layout === "comparison-pros-cons") {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
        style={frameStyle}
      >
        <div className="relative z-10 flex h-full flex-col">
          <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
            Comparison
          </Badge>
          <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
          <p className={`mb-5 ${t.textBody}`}>{form.body}</p>

          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className={`rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`mb-3 text-sm font-semibold ${t.accentText}`}>Option A - Pros</p>
              <ul className={`space-y-2 text-sm ${t.textBody}`}>
                {comparisonRows.map((row) => (
                  <li key={`left-${row.criterion}`}>
                    <span className={`font-medium ${t.textStrong}`}>{row.criterion}: </span>
                    {row.left}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
              <p className={`mb-3 text-sm font-semibold ${t.accentText}`}>Option B - Considerations</p>
              <ul className={`space-y-2 text-sm ${t.textBody}`}>
                {comparisonRows.map((row) => (
                  <li key={`right-${row.criterion}`}>
                    <span className={`font-medium ${t.textStrong}`}>{row.criterion}: </span>
                    {row.right}
                  </li>
                ))}
              </ul>
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
          Comparison
        </Badge>
        <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 ${t.textBody}`}>{form.body}</p>

        <div className={`flex-1 rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 text-sm">
            <p className={`font-semibold ${t.textMuted}`}>Criteria</p>
            <p className={`font-semibold ${t.accentText}`}>Approach A</p>
            <p className={`font-semibold ${t.accentText}`}>Approach B</p>

            {comparisonRows.map(({ criterion, left, right }) => (
              <div key={criterion} className="contents">
                <p className={t.textStrong}>{criterion}</p>
                <p className={t.textBody}>{left}</p>
                <p className={t.textBody}>{right}</p>
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
