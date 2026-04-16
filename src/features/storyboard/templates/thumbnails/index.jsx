function ThumbFrame({ children }) {
  return (
    <div className="h-14 w-20 rounded-lg border border-slate-300 bg-slate-50 p-1.5 shadow-sm">
      {children}
    </div>
  );
}

export function TitleThumb() {
  return (
    <ThumbFrame>
      <div className="flex h-full flex-col items-center justify-center gap-1.5 rounded-md bg-white px-2">
        <div className="h-1.5 w-10 rounded-full bg-slate-400" />
        <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        <div className="h-1.5 w-8 rounded-full bg-slate-300" />
      </div>
    </ThumbFrame>
  );
}

export function ContentImageThumb() {
  return (
    <ThumbFrame>
      <div className="grid h-full grid-cols-2 gap-1.5">
        <div className="space-y-1 rounded-md bg-white p-1.5">
          <div className="h-1.5 w-5 rounded-full bg-slate-400" />
          <div className="h-1.5 w-full rounded-full bg-slate-300" />
          <div className="h-1.5 w-4/5 rounded-full bg-slate-300" />
        </div>
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-200/70" />
      </div>
    </ThumbFrame>
  );
}

export function TabsThumb() {
  return (
    <ThumbFrame>
      <div className="h-full rounded-md bg-white p-1.5">
        <div className="mb-1.5 grid grid-cols-3 gap-1">
          <div className="h-1.5 rounded-full bg-slate-400" />
          <div className="h-1.5 rounded-full bg-slate-300" />
          <div className="h-1.5 rounded-full bg-slate-300" />
        </div>
        <div className="h-8 rounded-md bg-slate-100" />
      </div>
    </ThumbFrame>
  );
}

export function AccordionThumb() {
  return (
    <ThumbFrame>
      <div className="space-y-1.5 rounded-md bg-white p-1.5">
        <div className="h-2.5 rounded-md bg-slate-300" />
        <div className="h-2.5 rounded-md bg-slate-200" />
        <div className="h-2.5 rounded-md bg-slate-200" />
      </div>
    </ThumbFrame>
  );
}

export function ProcessThumb() {
  return (
    <ThumbFrame>
      <div className="flex h-full items-center justify-between gap-1 rounded-md bg-white px-1.5">
        {[0, 1, 2].map((step) => (
          <div key={step} className="flex flex-1 flex-col items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            <div className="h-1.5 w-full rounded-full bg-slate-300" />
          </div>
        ))}
      </div>
    </ThumbFrame>
  );
}

export function TimelineThumb() {
  return (
    <ThumbFrame>
      <div className="relative h-full rounded-md bg-white px-2 py-3">
        <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-slate-300" />
        <div className="flex h-full items-center justify-between">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          ))}
        </div>
      </div>
    </ThumbFrame>
  );
}

export function ClickRevealThumb() {
  return (
    <ThumbFrame>
      <div className="grid h-full grid-cols-2 gap-1.5 rounded-md bg-white p-1.5">
        <div className="grid grid-cols-2 gap-1">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-sm bg-slate-200" />
          ))}
        </div>
        <div className="space-y-1 rounded-md bg-slate-100 p-1.5">
          <div className="h-1.5 w-3/4 rounded-full bg-slate-400" />
          <div className="h-1.5 w-full rounded-full bg-slate-300" />
          <div className="h-1.5 w-4/5 rounded-full bg-slate-300" />
        </div>
      </div>
    </ThumbFrame>
  );
}

export function ScenarioThumb() {
  return (
    <ThumbFrame>
      <div className="h-full rounded-md bg-white p-1.5">
        <div className="mb-1.5 h-2 rounded-md bg-slate-300" />
        <div className="grid h-8 grid-cols-2 gap-1">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-sm bg-slate-200" />
          ))}
        </div>
      </div>
    </ThumbFrame>
  );
}

export function QuizThumb() {
  return (
    <ThumbFrame>
      <div className="h-full rounded-md bg-white p-1.5">
        <div className="mb-1.5 h-1.5 w-10 rounded-full bg-slate-400" />
        <div className="space-y-1">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-slate-300" />
              <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </ThumbFrame>
  );
}
