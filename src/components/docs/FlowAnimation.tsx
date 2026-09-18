import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type FlowActor = {
  id: string;
  label: string;
  Icon: LucideIcon;
  accent?: boolean;
};

export type FlowStepKind = "request" | "response" | "note" | "error";

export type FlowStep = {
  from: string;
  to: string;
  label: string;
  kind?: FlowStepKind;
  dashed?: boolean;
  payload?: { title: string; code: string };
};

export type FlowScenario = {
  id: string;
  label: string;
  steps: FlowStep[];
};

const ROW_HEIGHT = { wide: 72, narrow: 96 };
const STEP_MS = 2200;
const TRAVEL_S = 0.9;
const LINE_BOTTOM = 16;

const KIND_STYLES: Record<FlowStepKind, { text: string; dot: string }> = {
  request: { text: "text-blue-400", dot: "bg-blue-400" },
  response: { text: "text-emerald-400", dot: "bg-emerald-400" },
  error: { text: "text-rose-400", dot: "bg-rose-400" },
  note: { text: "text-slate-300", dot: "bg-slate-300" },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return narrow;
}

function StepBadge({ number }: { number: number }) {
  return (
    <span className="mr-1.5 inline-flex w-4 h-4 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-semibold text-slate-200 align-middle">
      {number}
    </span>
  );
}

function FlowRow({
  step,
  index,
  actors,
  active,
  visible,
  animate,
  narrow,
}: {
  step: FlowStep;
  index: number;
  actors: FlowActor[];
  active: boolean;
  visible: boolean;
  animate: boolean;
  narrow: boolean;
}) {
  const fromIndex = actors.findIndex((actor) => actor.id === step.from);
  const toIndex = actors.findIndex((actor) => actor.id === step.to);
  const center = (i: number) => ((i + 0.5) / actors.length) * 100;
  const kind = step.kind ?? (fromIndex === toIndex ? "note" : "request");
  const styles = KIND_STYLES[kind];
  const isNote = fromIndex === toIndex;
  const rowHeight = narrow ? ROW_HEIGHT.narrow : ROW_HEIGHT.wide;
  const rowStyle = {
    top: index * rowHeight,
    height: rowHeight,
    opacity: visible ? (active ? 1 : 0.55) : 0,
  };

  if (isNote) {
    const width = narrow ? 74 : 56;
    const left = clamp(center(fromIndex) - width / 2, 0, 100 - width);

    return (
      <div
        className="absolute inset-x-0 transition-opacity duration-300"
        style={rowStyle}
        aria-hidden="true"
      >
        <motion.div
          key={active ? "active" : "rest"}
          initial={active && animate ? { opacity: 0, scale: 0.94 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className={`absolute top-3 rounded-lg border px-3 py-2 text-center text-xs sm:text-[13px] leading-snug text-slate-200 bg-slate-800/90 ${
            active ? "border-blue-400/70" : "border-slate-600"
          }`}
          style={{ left: `${left}%`, width: `${width}%` }}
        >
          <StepBadge number={index + 1} />
          {step.label}
        </motion.div>
      </div>
    );
  }

  const fromPct = center(fromIndex);
  const toPct = center(toIndex);
  const left = Math.min(fromPct, toPct);
  const width = Math.abs(toPct - fromPct);
  const leftToRight = toIndex > fromIndex;
  const labelWidth = Math.max(width, narrow ? 64 : 48);
  const labelLeft = clamp(
    left + width / 2 - labelWidth / 2,
    0,
    100 - labelWidth,
  );
  const Chevron = leftToRight ? ChevronRight : ChevronLeft;
  const animateNow = active && animate;

  return (
    <div
      className="absolute inset-x-0 transition-opacity duration-300"
      style={rowStyle}
      aria-hidden="true"
    >
      <div
        className="absolute top-2 px-1 text-center text-xs sm:text-[13px] leading-snug text-slate-200"
        style={{ left: `${labelLeft}%`, width: `${labelWidth}%` }}
      >
        <StepBadge number={index + 1} />
        {step.label}
      </div>

      <div
        className={`absolute ${styles.text}`}
        style={{ left: `${left}%`, width: `${width}%`, bottom: LINE_BOTTOM }}
      >
        <motion.div
          key={active ? "active" : "rest"}
          initial={animateNow ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: TRAVEL_S, ease: "easeInOut" }}
          className={
            step.dashed
              ? "w-full border-t-2 border-dashed border-current"
              : "h-0.5 w-full bg-current"
          }
          style={{ transformOrigin: leftToRight ? "left" : "right" }}
        />
        <motion.div
          key={active ? "chevron-active" : "chevron-rest"}
          initial={animateNow ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: TRAVEL_S - 0.15, duration: 0.2 }}
          className={`absolute top-1/2 -translate-y-1/2 ${leftToRight ? "-right-1.5" : "-left-1.5"}`}
        >
          <Chevron className="w-4 h-4" strokeWidth={3} />
        </motion.div>
      </div>

      {animateNow && (
        <motion.div
          key="packet"
          initial={{ left: `${fromPct}%`, opacity: 1 }}
          animate={{ left: `${toPct}%`, opacity: [1, 1, 0] }}
          transition={{ duration: TRAVEL_S, ease: "easeInOut" }}
          className={`absolute w-3 h-3 -ml-1.5 rounded-full ${styles.dot}`}
          style={{ bottom: LINE_BOTTOM - 5 }}
        />
      )}
    </div>
  );
}

export function FlowAnimation({
  title = "See it in action",
  actors,
  scenarios,
}: {
  title?: string;
  actors: FlowActor[];
  scenarios: FlowScenario[];
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const narrow = useIsNarrow();
  const rowHeight = narrow ? ROW_HEIGHT.narrow : ROW_HEIGHT.wide;
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const steps = scenario.steps;
  const last = steps.length - 1;

  const [current, setCurrent] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Reduced motion: show the finished diagram instead of playing it.
  useEffect(() => {
    if (reduceMotion) {
      setPlaying(false);
      setCurrent(last);
    }
  }, [reduceMotion, last]);

  // Start once, the first time the diagram scrolls into view.
  useEffect(() => {
    const element = containerRef.current;
    if (reduceMotion || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // Advance one step at a time while playing.
  useEffect(() => {
    if (!playing) return;
    if (current >= last) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(
      () => setCurrent((step) => step + 1),
      current === -1 ? 400 : STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [playing, current, last]);

  const selectScenario = (id: string) => {
    const next = scenarios.find((s) => s.id === id) ?? scenarios[0];
    hasStarted.current = true;
    setScenarioId(next.id);
    if (reduceMotion) {
      setCurrent(next.steps.length - 1);
      setPlaying(false);
    } else {
      setCurrent(-1);
      setPlaying(true);
    }
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (current >= last) setCurrent(-1);
    setPlaying(true);
  };

  const restart = () => {
    setCurrent(-1);
    setPlaying(true);
  };

  const jumpTo = (index: number) => {
    setPlaying(false);
    setCurrent(index);
  };

  const shownPayload =
    steps
      .slice(0, Math.max(current, 0) + 1)
      .reverse()
      .find((step) => step.payload)?.payload ??
    steps.find((step) => step.payload)?.payload;

  return (
    <figure
      ref={containerRef}
      aria-label={title}
      className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden mb-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#252525] px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200">{title}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 border border-slate-600 rounded px-1.5 py-0.5">
            Sample
          </span>
        </div>
        {scenarios.length > 1 && (
          <div role="tablist" className="flex flex-wrap gap-1">
            {scenarios.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === scenario.id}
                onClick={() => selectScenario(item.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  item.id === scenario.id
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-5 pb-2">
        <div
          className="grid gap-2 mb-2"
          style={{
            gridTemplateColumns: `repeat(${actors.length}, minmax(0, 1fr))`,
          }}
        >
          {actors.map(({ id, label, Icon, accent }) => (
            <div key={id} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  accent
                    ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
                    : "bg-slate-800 border-slate-600 text-slate-300"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] sm:text-xs text-slate-300 text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative" style={{ height: steps.length * rowHeight }}>
          {actors.map(({ id }, i) => (
            <div
              key={id}
              className="absolute top-0 bottom-0 border-l border-dashed border-slate-700"
              style={{ left: `${((i + 0.5) / actors.length) * 100}%` }}
              aria-hidden="true"
            />
          ))}
          {steps.map((step, index) => (
            <FlowRow
              // steps are a static, ordered list
              // biome-ignore lint/suspicious/noArrayIndexKey: order never changes
              key={`${scenario.id}-${index}`}
              step={step}
              index={index}
              actors={actors}
              active={index === current}
              visible={index <= current}
              animate={!reduceMotion}
              narrow={narrow}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : current >= last ? "Replay" : "Play"}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-400 transition-colors"
          >
            {playing ? (
              <Pause className="w-4 h-4" />
            ) : current >= last ? (
              <RotateCcw className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={restart}
            aria-label="Restart"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {steps.map((step, index) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: order never changes
              key={`${scenario.id}-dot-${index}`}
              type="button"
              onClick={() => jumpTo(index)}
              aria-label={`Go to step ${index + 1}: ${step.label}`}
              aria-current={index === current ? "step" : undefined}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-6 bg-blue-400"
                  : index < current
                    ? "w-2 bg-blue-400/50"
                    : "w-2 bg-slate-600"
              }`}
            />
          ))}
        </div>

        <p
          aria-live="polite"
          className="basis-full sm:basis-0 sm:flex-1 min-w-0 text-sm text-slate-300"
        >
          <span className="text-slate-500 mr-2">
            {current < 0 ? "Ready" : `Step ${current + 1} of ${steps.length}`}
          </span>
          {current < 0
            ? "Press play to follow a request through SynchGate."
            : steps[current].label}
        </p>
      </div>

      {shownPayload && (
        <div className="border-t border-slate-800 bg-[#1e1e1e]">
          <div className="px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-800">
            {shownPayload.title}
          </div>
          <pre className="px-4 py-3 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto max-h-64">
            <code>{shownPayload.code}</code>
          </pre>
        </div>
      )}

      <ol className="sr-only">
        {steps.map((step, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: order never changes
          <li key={`${scenario.id}-sr-${index}`}>
            {actors.find((a) => a.id === step.from)?.label}
            {step.from === step.to
              ? ": "
              : ` to ${actors.find((a) => a.id === step.to)?.label}: `}
            {step.label}
          </li>
        ))}
      </ol>
    </figure>
  );
}
