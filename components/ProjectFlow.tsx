"use client";

import { useEffect, useRef, useState } from "react";
import type { FlowStep } from "@/data/repos";

// An animated "pipeline run" for a project: steps light up one after another, finished steps get a ✓,
// and a dot travels down to the next step — like watching the automation run.
// Grouped steps (agents/tools that work side by side) light up together.
// It only runs while visible on screen, and stays still for people who prefer reduced motion.
const TICK = 1100; // ms per step
const HOLD = 2; // extra ticks to show the finished run before restarting

export default function ProjectFlow({ steps, title }: { steps: FlowStep[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1); // -1 = idle (static), steps.length.. = finished
  const n = steps.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearInterval(timer);
        if (!entry.isIntersecting) return;
        setActive((a) => (a < 0 ? 0 : a));
        timer = setInterval(() => setActive((a) => (a + 1 > n + HOLD ? 0 : a + 1)), TICK);
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [n]);

  const finished = active >= n;
  const state = (i: number) => (active < 0 ? "idle" : i < active || finished ? "done" : i === active ? "active" : "todo");

  return (
    <div ref={ref} className="mt-5 max-w-sm">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-hand text-xl leading-none text-purple">how it works</span>
        <span aria-hidden="true" className="text-xs text-muted">
          {active < 0 ? `${n} steps` : finished ? "done ✓" : `running · step ${active + 1}/${n}`}
        </span>
      </div>

      <ol aria-label={`How ${title} works`}>
        {steps.map((step, i) => {
          const s = state(i);
          const last = i === n - 1;
          return (
            <li key={typeof step === "string" ? step : step.group} className={`relative flex gap-3 ${last ? "" : "pb-3"}`}>
              {/* connector to the next step */}
              {!last && (
                <span aria-hidden="true" className="absolute top-6 bottom-0 left-[11px] w-px overflow-hidden bg-line">
                  <span
                    className={`absolute inset-0 origin-top bg-purple transition-transform duration-500 ${
                      s === "done" ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                  {s === "active" && <span key={active} className="flow-dot absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-purple" />}
                </span>
              )}

              {/* step marker */}
              <span
                aria-hidden="true"
                className={`relative z-10 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-300 ${
                  s === "done"
                    ? "border-text bg-text text-bg"
                    : s === "active"
                      ? "border-purple bg-purple text-bg"
                      : "border-line bg-surface text-muted"
                }`}
              >
                {s === "active" && <span className="absolute inset-0 animate-ping rounded-full bg-purple/40" />}
                <span className="relative">{s === "done" ? "✓" : i + 1}</span>
              </span>

              {/* step content */}
              {typeof step === "string" ? (
                <span
                  className={`pt-0.5 text-[14px] leading-snug transition-colors duration-300 ${
                    s === "active" ? "font-semibold text-purple" : s === "todo" ? "text-muted" : ""
                  }`}
                >
                  {step}
                </span>
              ) : (
                <span className="min-w-0 pt-0.5">
                  <span
                    className={`block text-[14px] leading-snug transition-colors duration-300 ${
                      s === "active" ? "font-semibold text-purple" : s === "todo" ? "text-muted" : ""
                    }`}
                  >
                    {step.group} <span className="font-normal text-muted">· side by side</span>
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-1">
                    {step.items.map((item, j) => (
                      <span
                        key={item}
                        style={{ transitionDelay: s === "active" ? `${j * 70}ms` : "0ms" }}
                        className={`rounded border px-1.5 py-0.5 text-[12px] leading-tight transition-colors duration-300 ${
                          s === "active"
                            ? "border-purple bg-purple text-bg"
                            : s === "done"
                              ? "border-text/40 bg-surface"
                              : "border-line bg-surface text-muted"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
