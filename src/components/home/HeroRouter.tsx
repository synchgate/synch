import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const PROVIDERS = [
  { id: "paystack", name: "Paystack" },
  { id: "flutterwave", name: "Flutterwave" },
  { id: "nomba", name: "Nomba" },
];

const CYCLE_MS = 5600;
const TRAVEL_S = 4.4;

// Scene geometry in SVG units (viewBox 0 0 492 280)
const APP = { x: 8, y: 98, w: 104, h: 84 };
const HUB = { x: 188, y: 84, w: 116, h: 112 };
const PROVIDER_X = 372;
const PROVIDER_W = 112;
const PROVIDER_H = 46;
const PROVIDER_Y = [18, 117, 216];
const MID_Y = 140;

const CAPTIONS = [
  "Your app sends one request",
  "SynchGate picks the provider",
  "The provider creates the checkout",
  "You get the same response, whichever provider it was",
];
// When each caption appears, in ms into a cycle
const CAPTION_AT = [0, 1000, 2000, 3300];

const BLUE = "#2563eb";
const GREEN = "#059669";
const LINE = "#cbd5e1";

export function HeroRouter() {
  const reduceMotion = useReducedMotion() ?? false;
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: restart the captions whenever a new cycle begins
  useEffect(() => {
    if (reduceMotion) {
      setPhase(3);
      return;
    }
    setPhase(0);
    const timers = CAPTION_AT.slice(1).map((at, i) =>
      setTimeout(() => setPhase(i + 1), at),
    );
    return () => timers.forEach(clearTimeout);
  }, [cycle, reduceMotion]);

  const active = cycle % PROVIDERS.length;
  const provider = PROVIDERS[active];
  const targetY = PROVIDER_Y[active] + PROVIDER_H / 2;
  const times = [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1];

  return (
    <div className="relative mx-auto mt-16 w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur sm:p-6">
      <svg
        viewBox="0 0 492 280"
        className="h-auto w-full"
        role="img"
        aria-label="Your app sends one request to SynchGate, which routes it to Paystack, Flutterwave or Nomba and returns one normalised response."
      >
        <title>How SynchGate routes a payment</title>

        {/* connections */}
        <path
          d={`M${APP.x + APP.w} ${MID_Y} L${HUB.x} ${MID_Y}`}
          stroke={LINE}
          strokeWidth="2"
          strokeDasharray="5 5"
          fill="none"
        />
        {PROVIDER_Y.map((y, i) => {
          const cy = y + PROVIDER_H / 2;
          const d = `M${HUB.x + HUB.w} ${MID_Y} C 340 ${MID_Y}, 340 ${cy}, ${PROVIDER_X} ${cy}`;
          return i === active && !reduceMotion ? (
            <motion.path
              key={`${cycle}-line`}
              d={d}
              fill="none"
              strokeWidth="2.5"
              initial={{ stroke: LINE }}
              animate={{ stroke: [LINE, LINE, BLUE, BLUE, LINE] }}
              transition={{
                duration: TRAVEL_S,
                times: [0, 0.28, 0.4, 0.72, 0.8],
              }}
            />
          ) : (
            <path
              key={PROVIDERS[i].id}
              d={d}
              stroke={i === active ? BLUE : LINE}
              strokeWidth={i === active ? 2.5 : 2}
              strokeDasharray={i === active ? undefined : "5 5"}
              fill="none"
            />
          );
        })}

        {/* your app */}
        <rect
          x={APP.x}
          y={APP.y}
          width={APP.w}
          height={APP.h}
          rx="16"
          fill="#f8fafc"
          stroke="#cbd5e1"
        />
        <text
          x={APP.x + APP.w / 2}
          y={APP.y + 36}
          textAnchor="middle"
          fontSize="15"
          fontWeight="600"
          fill="#0f172a"
        >
          Your app
        </text>
        <text
          x={APP.x + APP.w / 2}
          y={APP.y + 58}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          one request
        </text>

        {/* SynchGate */}
        <rect
          x={HUB.x}
          y={HUB.y}
          width={HUB.w}
          height={HUB.h}
          rx="20"
          fill="#0f172a"
        />
        <text
          x={HUB.x + HUB.w / 2}
          y={HUB.y + 50}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#ffffff"
        >
          SynchGate
        </text>
        <text
          x={HUB.x + HUB.w / 2}
          y={HUB.y + 72}
          textAnchor="middle"
          fontSize="10"
          fill="#94a3b8"
        >
          routes and normalises
        </text>

        {/* providers */}
        {PROVIDERS.map((p, i) => {
          const y = PROVIDER_Y[i];
          const isActive = i === active;
          const common = {
            x: PROVIDER_X,
            y,
            width: PROVIDER_W,
            height: PROVIDER_H,
            rx: 12,
          };
          return (
            <g key={p.id}>
              {isActive && !reduceMotion ? (
                <motion.rect
                  key={`${cycle}-provider`}
                  {...common}
                  strokeWidth="2"
                  initial={{ fill: "#ffffff", stroke: "#cbd5e1" }}
                  animate={{
                    fill: [
                      "#ffffff",
                      "#ffffff",
                      "#eff6ff",
                      "#eff6ff",
                      "#ffffff",
                    ],
                    stroke: ["#cbd5e1", "#cbd5e1", BLUE, BLUE, "#cbd5e1"],
                  }}
                  transition={{
                    duration: TRAVEL_S,
                    times: [0, 0.4, 0.5, 0.72, 0.85],
                  }}
                />
              ) : (
                <rect
                  {...common}
                  fill={isActive ? "#eff6ff" : "#ffffff"}
                  stroke={isActive ? BLUE : "#cbd5e1"}
                  strokeWidth="2"
                />
              )}
              <text
                x={PROVIDER_X + PROVIDER_W / 2}
                y={y + PROVIDER_H / 2 + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="#0f172a"
              >
                {p.name}
              </text>
            </g>
          );
        })}

        {/* the request travelling out (blue) and the response coming back (green) */}
        {!reduceMotion && (
          <motion.circle
            key={`${cycle}-packet`}
            r="7"
            initial={{ cx: APP.x + APP.w, cy: MID_Y, fill: BLUE, opacity: 0 }}
            animate={{
              cx: [
                APP.x + APP.w,
                HUB.x,
                HUB.x + HUB.w,
                PROVIDER_X,
                HUB.x + HUB.w,
                HUB.x,
                APP.x + APP.w,
              ],
              cy: [MID_Y, MID_Y, MID_Y, targetY, MID_Y, MID_Y, MID_Y],
              fill: [BLUE, BLUE, BLUE, BLUE, GREEN, GREEN, GREEN],
              opacity: [1, 1, 1, 1, 1, 1, 0],
            }}
            transition={{ duration: TRAVEL_S, times, ease: "easeInOut" }}
          />
        )}
      </svg>

      <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="mb-2 flex gap-1.5" aria-hidden="true">
            {CAPTIONS.map((caption, i) => (
              <span
                key={caption}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === phase ? "w-8 bg-blue-600" : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>
          <p
            aria-live="off"
            className="min-h-[2.5rem] text-sm font-medium text-slate-700 sm:text-base"
          >
            {provider && phase === 2
              ? `${provider.name} creates the checkout`
              : CAPTIONS[phase]}
          </p>
        </div>

        <motion.pre
          key={`${cycle}-response`}
          initial={reduceMotion ? false : { opacity: 0.3 }}
          animate={{ opacity: phase >= 3 ? 1 : 0.3 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 text-left font-mono text-[11px] leading-relaxed text-slate-200 sm:text-xs"
        >
          {`{
  "status": "success",
  "provider": "${provider.id}",
  "payment_url": "https://…"
}`}
        </motion.pre>
      </div>
    </div>
  );
}
