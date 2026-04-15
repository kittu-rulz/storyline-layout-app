import { getResolvedSlideSize } from "@/components/storyline/slideSize";

const DEFAULT_MARGINS = {
  top: 120,
  bottom: 140,
  left: 120,
  right: 120,
};
const GRID_STEP_PX = 50;
const RULER_STEP_PX = 50;
const RULER_LABEL_STEP_PX = 100;
const RULER_SIZE_PX = 24;

function toSafeMargin(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildTicks(total) {
  if (!Number.isFinite(total) || total <= 0) return [];

  const ticks = [];
  for (let value = 0; value <= total; value += RULER_STEP_PX) {
    ticks.push({
      value,
      percent: (value / total) * 100,
      isMajor: value % RULER_LABEL_STEP_PX === 0,
    });
  }

  if (ticks[ticks.length - 1]?.value !== total) {
    ticks.push({ value: total, percent: 100, isMajor: true });
  }

  return ticks;
}

function MarginBadge({ style, children }) {
  return (
    <div
      className="absolute rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/80"
      style={style}
    >
      {children}
    </div>
  );
}

function Zone({ style, className, label }) {
  return (
    <div className={`absolute border border-dashed flex items-center justify-center ${className}`} style={style}>
      {label ? <span className="px-2 text-[11px] font-medium">{label}</span> : null}
    </div>
  );
}

export function SafeGridOverlay({ form }) {
  const showSafeGrid = Boolean(form.showSafeGrid);
  const showGridLabels = Boolean(form.showGridLabels) && showSafeGrid;
  const showPixelGrid = Boolean(form.showPixelGrid);
  const showRulers = Boolean(form.showRulers);

  if (!showSafeGrid && !showPixelGrid && !showRulers) {
    return null;
  }

  const margins = {
    top: toSafeMargin(form.safeMargins?.top, DEFAULT_MARGINS.top),
    bottom: toSafeMargin(form.safeMargins?.bottom, DEFAULT_MARGINS.bottom),
    left: toSafeMargin(form.safeMargins?.left, DEFAULT_MARGINS.left),
    right: toSafeMargin(form.safeMargins?.right, DEFAULT_MARGINS.right),
  };
  const slideSize = getResolvedSlideSize(form);
  const gridStepX = (GRID_STEP_PX / slideSize.width) * 100;
  const gridStepY = (GRID_STEP_PX / slideSize.height) * 100;
  const xTicks = buildTicks(slideSize.width);
  const yTicks = buildTicks(slideSize.height);
  const labelOffset = showRulers ? RULER_SIZE_PX + 4 : 4;
  const safeFrame = {
    top: margins.top,
    bottom: Math.max(margins.top, slideSize.height - margins.bottom),
    left: margins.left,
    right: Math.max(margins.left, slideSize.width - margins.right),
  };
  const safeFrameWidth = Math.max(0, safeFrame.right - safeFrame.left);
  const safeFrameHeight = Math.max(0, safeFrame.bottom - safeFrame.top);
  const headerZoneHeight = safeFrameHeight > 0 ? clamp(Math.round(safeFrameHeight * 0.18), 40, safeFrameHeight) : 0;
  const footerZoneHeight = safeFrameHeight > 0 ? clamp(Math.round(safeFrameHeight * 0.15), 32, safeFrameHeight) : 0;
  const contentZoneHeight = Math.max(24, safeFrameHeight - headerZoneHeight - footerZoneHeight);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {showPixelGrid ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15, 23, 42, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.12) 1px, transparent 1px)",
            backgroundSize: `${gridStepX}% ${gridStepY}%`,
          }}
        />
      ) : null}

      {showSafeGrid ? (
        <>
          <div className="absolute top-0 bottom-0 border-l border-dashed border-slate-300" style={{ left: `${margins.left}px` }} />
          <div className="absolute top-0 bottom-0 border-l border-dashed border-slate-300" style={{ right: `${margins.right}px` }} />

          {safeFrameWidth > 0 && safeFrameHeight > 0 ? (
            <>
              <div
                className="absolute border border-dashed border-slate-400/70"
                style={{
                  top: `${safeFrame.top}px`,
                  left: `${safeFrame.left}px`,
                  width: `${safeFrameWidth}px`,
                  height: `${safeFrameHeight}px`,
                }}
              />

              <Zone
                className="border-rose-300 bg-rose-50/35 text-rose-600"
                style={{
                  top: `${safeFrame.top}px`,
                  left: `${safeFrame.left}px`,
                  width: `${safeFrameWidth}px`,
                  height: `${headerZoneHeight}px`,
                }}
                label={showGridLabels ? "Approx. headline zone" : null}
              />
              <Zone
                className="border-emerald-300 bg-emerald-50/25 text-emerald-700"
                style={{
                  top: `${safeFrame.top + headerZoneHeight}px`,
                  left: `${safeFrame.left}px`,
                  width: `${safeFrameWidth}px`,
                  height: `${contentZoneHeight}px`,
                }}
                label={showGridLabels ? "Approx. content zone" : null}
              />
              <Zone
                className="border-amber-300 bg-amber-50/30 text-amber-700"
                style={{
                  top: `${safeFrame.bottom - footerZoneHeight}px`,
                  left: `${safeFrame.left}px`,
                  width: `${safeFrameWidth}px`,
                  height: `${footerZoneHeight}px`,
                }}
                label={showGridLabels ? "Approx. controls zone" : null}
              />
            </>
          ) : null}

          <MarginBadge style={{ top: `${labelOffset}px`, left: "50%", transform: "translateX(-50%)" }}>
            Top: {margins.top}px
          </MarginBadge>
          <MarginBadge style={{ bottom: "4px", left: "50%", transform: "translateX(-50%)" }}>
            Bottom: {margins.bottom}px
          </MarginBadge>
          <MarginBadge style={{ top: "50%", left: `${labelOffset}px`, transform: "translateY(-50%)" }}>
            Left: {margins.left}px
          </MarginBadge>
          <MarginBadge style={{ top: "50%", right: "4px", transform: "translateY(-50%)" }}>
            Right: {margins.right}px
          </MarginBadge>
        </>
      ) : null}

      {showRulers ? (
        <>
          <div className="absolute left-0 right-0 top-0 h-6 border-b border-slate-300/80 bg-white/80 backdrop-blur-[2px]">
            <div className="absolute inset-0">
              {xTicks.map((tick) => (
                <div key={`x-${tick.value}`} className="absolute top-0 h-full" style={{ left: `${tick.percent}%` }}>
                  <div className={`border-l ${tick.isMajor ? "h-full border-slate-500/70" : "h-1/2 border-slate-400/60"}`} />
                  {tick.isMajor && tick.value > 0 ? (
                    <span className="absolute left-1 top-0.5 text-[10px] leading-none text-slate-500">{tick.value}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 top-0 w-6 border-r border-slate-300/80 bg-white/80 backdrop-blur-[2px]">
            <div className="absolute inset-0">
              {yTicks.map((tick) => (
                <div key={`y-${tick.value}`} className="absolute left-0 w-full" style={{ top: `${tick.percent}%` }}>
                  <div className={`border-t ${tick.isMajor ? "w-full border-slate-500/70" : "w-1/2 border-slate-400/60"}`} />
                  {tick.isMajor && tick.value > 0 ? (
                    <span className="absolute right-0.5 top-0 -translate-y-1/2 text-[9px] leading-none text-slate-500">{tick.value}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center border-b border-r border-slate-300/80 bg-white/90 text-[9px] font-medium text-slate-500">
            px
          </div>
        </>
      ) : null}
    </div>
  );
}
