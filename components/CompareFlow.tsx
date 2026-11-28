"use client";

import { useEffect, useRef, useState } from "react";
import type { CompareDiagram, Verdict } from "@/data/repos";

// Animated comparison run: sources are fetched one by one, claims are extracted into a
// source × attribute table, then each attribute is compared across sources and labelled.
// Runs only while visible; shows the finished table, without motion, for reduced-motion users.

const TICK = 750;
const HOLD = 4;

const badge: Record<Verdict, string> = {
  Conflict: "bg-marker text-[#7a5200] border-[#e0b93a]",
  Consistent: "bg-success/10 text-success border-success/40",
  "Changed over time": "bg-blue/10 text-blue border-blue/40",
  "Not comparable": "bg-surface-2 text-muted border-line",
};

export default function CompareFlow({ diagram, title }: { diagram: CompareDiagram; title: string }) {
  const { topic, sources, rows, output } = diagram;
  const s = sources.length;
  const r = rows.length;
  const last = s + 2 * r + HOLD;

  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(-1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(s + 2 * r); // finished
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        clearInterval(timer);
        if (!e.isIntersecting) return;
        setT((v) => (v < 0 ? 0 : v));
        timer = setInterval(() => setT((v) => (v + 1 > last ? 0 : v + 1)), TICK);
      },
      { threshold: 0.4 },
    );
    if (ref.current) io.observe(ref.current);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [last, s, r]);

  // phase bookkeeping
  const fetched = (i: number) => t > i; // source i fetched after its tick
  const fetching = (i: number) => t === i;
  const extracted = (row: number) => t >= s + row; // row's claims visible
  const extracting = (row: number) => t === s + row;
  const compared = (row: number) => t >= s + r + row;
  const comparing = (row: number) => t === s + r + row;
  const done = t >= s + 2 * r;

  const narration =
    t < 0
      ? `Compares what ${s} sources say about one topic`
      : t < s
        ? `Fetching ${sources[t]} and saving a snapshot…`
        : t < s + r
          ? `Extracting “${rows[t - s].label}” claims, keeping the exact excerpt`
          : t < s + 2 * r
            ? `Comparing “${rows[t - s - r].label}” across sources → ${rows[t - s - r].verdict}`
            : `${output} ✓`;

  const cols = `5.2rem repeat(${s}, minmax(0, 1fr))`;

  return (
    <div ref={ref} className="mt-5 max-w-sm">
      <span className="font-hand text-xl leading-none text-purple">how it finds the gaps</span>
      <p aria-hidden="true" className="mt-1 mb-3 min-h-[2.5em] text-xs leading-snug text-muted">
        {narration}
      </p>

      <div
        role="table"
        aria-label={`${title} example: ${rows.map((row) => `${row.label} — ${row.verdict}`).join("; ")}`}
        className="overflow-hidden rounded-md border border-line bg-surface text-[12px] leading-tight"
      >
        {/* topic */}
        <div className="border-b border-line bg-bg/60 px-2.5 py-1.5 text-muted">
          Topic: <span className="font-semibold text-text">{topic}</span>
        </div>

        {/* source header */}
        <div role="row" className="grid gap-1 border-b border-line px-1.5 py-1.5" style={{ gridTemplateColumns: cols }}>
          <span role="columnheader" className="px-1 py-1 text-muted">Claim</span>
          {sources.map((src, i) => (
            <span
              role="columnheader"
              key={src}
              className={`truncate rounded px-1.5 py-1 text-center transition-colors duration-300 ${
                fetching(i)
                  ? "bg-purple font-semibold text-bg"
                  : fetched(i) || done
                    ? "bg-text font-semibold text-bg"
                    : "bg-surface-2 text-muted"
              }`}
            >
              {src}
            </span>
          ))}
        </div>

        {/* claims */}
        {rows.map((row, ri) => (
          <div key={row.label} className={`border-b border-line px-1.5 py-1.5 last:border-b-0 ${comparing(ri) ? "bg-purple/5" : ""}`}>
            <div role="row" className="grid items-center gap-1" style={{ gridTemplateColumns: cols }}>
              <span role="rowheader" className={`px-1 ${extracted(ri) ? "font-semibold" : "text-muted"}`}>
                {row.label}
              </span>
              {row.values.map((v, ci) => (
                <span
                  role="cell"
                  key={ci}
                  style={{ transitionDelay: extracting(ri) ? `${ci * 90}ms` : "0ms" }}
                  className={`rounded border px-1 py-1 text-center transition-all duration-300 ${
                    !extracted(ri)
                      ? "border-dashed border-line text-transparent"
                      : comparing(ri) && row.verdict === "Conflict" && row.odd?.includes(ci)
                        ? "border-[#e0b93a] bg-marker/60"
                        : v
                          ? "border-line bg-bg"
                          : "border-dashed border-line text-muted"
                  }`}
                >
                  {v || "not stated"}
                </span>
              ))}
            </div>
            <div className="mt-1 flex h-5 items-center justify-end">
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-all duration-300 ${badge[row.verdict]} ${
                  compared(ri) ? "scale-100 opacity-100" : "scale-90 opacity-0"
                }`}
              >
                {row.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 text-[11px] text-muted">
        Example data. Findings go to a person for review — the tool never says “true” or “false”.
      </p>
    </div>
  );
}
