import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeGridOverlay } from "@/components/storyline/SafeGridOverlay";

const FALLBACK_TIMELINE_EVENTS = [
  { title: "Kickoff", detail: "Define scope, stakeholders, and delivery milestones." },
  { title: "Design", detail: "Create the content and interaction blueprint." },
  { title: "Build", detail: "Develop Storyline slides, states, and triggers." },
  { title: "Launch", detail: "Deploy, validate tracking, and monitor outcomes." },
];

function getTimelineEvents(form) {
  if (!Array.isArray(form.timelineEvents) || form.timelineEvents.length === 0) {
    return FALLBACK_TIMELINE_EVENTS;
  }

  return form.timelineEvents.map((item, index) => ({
    title:
      typeof item?.title === "string" && item.title.length > 0
        ? item.title
        : `Event ${index + 1}`,
    detail: typeof item?.detail === "string" ? item.detail : "",
  }));
}

export function TimelineLayoutPreview({ form, t, frameStyle }) {
  const timelineEvents = getTimelineEvents(form);

  if (form.layout === "timeline-milestones") {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-3xl border p-8 shadow-sm ${t.surface} ${t.surfaceBorder}`}
        style={frameStyle}
      >
        <div className="relative z-10 flex h-full flex-col">
          <Badge className={`mb-4 w-fit border-0 ${t.accentSoft} ${t.accentText}`}>
            Timeline
          </Badge>
          <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
          <p className={`mb-5 ${t.textBody}`}>{form.body}</p>

          <div className={`flex-1 rounded-3xl border p-5 ${t.surfaceMuted} ${t.surfaceBorder}`}>
            <div className="relative h-full">
              <div className={`absolute left-8 right-8 top-1/2 border-t-2 border-dashed ${t.line}`} />
              <div
                className="grid h-full gap-3"
                style={{ gridTemplateColumns: `repeat(${Math.max(1, timelineEvents.length)}, minmax(0, 1fr))` }}
              >
                {timelineEvents.map((event, index) => (
                  <div key={`${event.title}-${index}`} className="z-10 flex flex-col items-center justify-center text-center">
                    <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${t.accent}`}>
                      {index + 1}
                    </div>
                    <p className={`text-sm font-medium ${t.textStrong}`}>{event.title}</p>
                    <p className={`mt-1 text-xs ${t.textMuted}`}>{event.detail}</p>
                  </div>
                ))}
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
          Timeline
        </Badge>
        <h2 className={`mb-2 text-3xl font-bold ${t.textStrong}`}>{form.title}</h2>
        <p className={`mb-5 ${t.textBody}`}>{form.body}</p>

        <div className={`flex-1 rounded-3xl border p-6 ${t.surfaceMuted} ${t.surfaceBorder}`}>
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div key={`${event.title}-${index}`} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white ${t.accent}`}>
                    {index + 1}
                  </div>
                  {index < timelineEvents.length - 1 ? <div className={`mt-1 h-8 border-l border-dashed ${t.line}`} /> : null}
                </div>
                <div>
                  <p className={`font-medium ${t.textStrong}`}>{event.title}</p>
                  <p className={`text-sm ${t.textMuted}`}>{event.detail}</p>
                </div>
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
