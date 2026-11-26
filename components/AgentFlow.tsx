"use client";

import { useEffect, useRef, useState } from "react";
import type { AgentDiagram } from "@/data/repos";

// Animated multi-agent run: the main agent calls a sub-agent (packet out), the sub-agent works,
// sends its answer back (packet in), the main agent stores it, and at the end combines every
// answer into the output. Agents in the same round are called at the same time (parallel).
// Runs only while visible; shows the finished state, without motion, for reduced-motion users.

const TICK = 700; // ms per phase
const HOLD = 3; // ticks to show the finished run before restarting
const W = 340;
const BOX_H = 24;
const GAP = 6;
const MAIN_W = 130;
const SUB_X = 190;
const SUB_W = W - SUB_X;

type Phase = "call" | "work" | "reply" | "store";
const PHASES: Phase[] = ["call", "work", "reply", "store"];

export default function AgentFlow({ diagram, title }: { diagram: AgentDiagram; title: string }) {
  const { input, main, rounds, store, output } = diagram;
  const agents = rounds.flat();
  const m = agents.length;
  const roundOf = (a: string) => rounds.findIndex((r) => r.includes(a));
  const last = rounds.length * 4 + HOLD; // final tick index
  const maxRound = Math.max(...rounds.map((r) => r.length));

  // geometry
  const subTop = 44;
  const subY = (k: number) => subTop + k * (BOX_H + GAP);
  const subsBottom = subY(m - 1) + BOX_H;
  const mainH = 40;
  const mainCy = subTop + (subsBottom - subTop) / 2;
  const mainTop = mainCy - mainH / 2;
  const storeY = subsBottom + 16;
  const storeH = 34;
  const outY = storeY + storeH + 16;
  const H = outY + 28 + 1;
  const midMain = MAIN_W / 2;

  const ref = useRef<HTMLDivElement>(null);
  const packets = useRef<(SVGCircleElement | null)[]>([]);
  const [t, setT] = useState(-1); // -1 = not started
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
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
  }, [last]);

  // where are we?
  const r = t >= 0 && t < rounds.length * 4 ? Math.floor(t / 4) : -1; // current round
  const phase: Phase | "combine" | "done" | "idle" =
    still ? "done" : t < 0 ? "idle" : r >= 0 ? PHASES[t % 4] : t === rounds.length * 4 ? "combine" : "done";
  const roundAgents = r >= 0 ? rounds[r] : [];
  const answered = (a: string) =>
    phase === "done" || phase === "combine" || roundOf(a) < r || (roundOf(a) === r && (phase === "reply" || phase === "store"));
  const stored = (a: string) => phase === "done" || phase === "combine" || roundOf(a) < r || (roundOf(a) === r && phase === "store");
  const storedCount = agents.filter(stored).length;

  // packet paths for the current phase
  const paths: [number, number, number, number][] = [];
  if (phase === "call" || phase === "reply") {
    for (const a of roundAgents) {
      const cy = subY(agents.indexOf(a)) + BOX_H / 2;
      paths.push(phase === "call" ? [MAIN_W, mainCy, SUB_X, cy] : [SUB_X, cy, MAIN_W, mainCy]);
    }
  } else if (phase === "store") paths.push([midMain, mainTop + mainH, midMain, storeY]);
  else if (phase === "combine") paths.push([W / 2, storeY + storeH, W / 2, outY]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / (TICK * 0.8));
      const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      packets.current.forEach((c, i) => {
        if (!c) return;
        const path = paths[i];
        if (!path) return void c.setAttribute("opacity", "0");
        c.setAttribute("opacity", "1");
        c.setAttribute("cx", String(path[0] + (path[2] - path[0]) * e));
        c.setAttribute("cy", String(path[1] + (path[3] - path[1]) * e));
      });
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const names = (list: string[]) => (list.length > 1 ? `${list.length} agents at once` : list[0]);
  const narration =
    phase === "idle"
      ? `${main} calls ${m} agents and combines their answers`
      : phase === "call"
        ? `${main} → asks ${names(roundAgents)}`
        : phase === "work"
          ? `${names(roundAgents)} working…`
          : phase === "reply"
            ? `${names(roundAgents)} → sends the answer back`
            : phase === "store"
              ? `${main} saves it to ${store}`
              : phase === "combine"
                ? `${main} combines all answers → ${output}`
                : "done ✓";

  const busy = (a: string) => roundAgents.includes(a) && (phase === "call" || phase === "work");

  return (
    <div ref={ref} className="mt-5 max-w-sm">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="font-hand text-xl leading-none text-purple">how the agents work together</span>
      </div>
      <p aria-hidden="true" className="mb-3 min-h-[2.5em] text-xs leading-snug text-muted">
        {narration}
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title}: ${input} → ${main}, which calls ${agents.join(", ")}; answers are stored in ${store} and combined into ${output}.`}>
        {/* input → main */}
        <line x1={midMain} y1={28} x2={midMain} y2={mainTop} className="stroke-line" strokeWidth={1.5} />
        {/* main ↔ sub-agents */}
        {agents.map((a, k) => (
          <line
            key={a}
            x1={MAIN_W}
            y1={mainCy}
            x2={SUB_X}
            y2={subY(k) + BOX_H / 2}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${roundAgents.includes(a) && phase !== "store" ? "stroke-purple" : "stroke-line"}`}
          />
        ))}
        {/* main → store → output */}
        <line x1={midMain} y1={mainTop + mainH} x2={midMain} y2={storeY} strokeWidth={1.5} className={phase === "store" ? "stroke-purple" : "stroke-line"} />
        <line x1={W / 2} y1={storeY + storeH} x2={W / 2} y2={outY} strokeWidth={1.5} className={phase === "combine" ? "stroke-purple" : "stroke-line"} />

        {/* input */}
        <rect x={0.5} y={0.5} width={W - 1} height={27} rx={5} className="fill-surface stroke-line" />
        <text x={W / 2} y={18} textAnchor="middle" className="fill-text text-[12px]">{input}</text>

        {/* main agent */}
        <rect
          x={0.5}
          y={mainTop}
          width={MAIN_W - 1}
          height={mainH}
          rx={6}
          className={`transition-colors duration-300 ${phase === "idle" ? "fill-surface stroke-text" : "fill-text stroke-text"}`}
        />
        <text x={midMain} y={mainCy + 4} textAnchor="middle" className={`text-[13px] font-semibold ${phase === "idle" ? "fill-text" : "fill-bg"}`}>
          {main}
        </text>

        {/* sub-agents */}
        {agents.map((a, k) => {
          const y = subY(k);
          const isBusy = busy(a);
          return (
            <g key={a}>
              <rect
                x={SUB_X + 0.5}
                y={y + 0.5}
                width={SUB_W - 1}
                height={BOX_H - 1}
                rx={5}
                className={`transition-colors duration-300 ${
                  isBusy ? "fill-purple stroke-purple" : answered(a) ? "fill-surface stroke-text" : "fill-surface stroke-line"
                }`}
              />
              <text x={SUB_X + 9} y={y + 16} className={`text-[12px] ${isBusy ? "fill-bg font-semibold" : answered(a) ? "fill-text" : "fill-muted"}`}>
                {a}
              </text>
              {answered(a) && (
                <text x={W - 10} y={y + 16} textAnchor="end" className="fill-success text-[12px] font-semibold">✓</text>
              )}
              {isBusy && phase === "work" && (
                <text x={W - 10} y={y + 16} textAnchor="end" className="fill-bg text-[12px]">…</text>
              )}
            </g>
          );
        })}

        {/* store (memory / results) */}
        <rect x={0.5} y={storeY + 0.5} width={W - 1} height={storeH - 1} rx={5} className={`fill-surface ${phase === "store" ? "stroke-purple" : "stroke-line"}`} strokeDasharray="4 3" />
        <text x={10} y={storeY + 21} className="fill-text text-[12px]">
          {store} <tspan className="fill-muted">· {storedCount}/{m} answers</tspan>
        </text>
        {agents.map((a, k) => (
          <rect
            key={a}
            x={W - 10 - (m - k) * 14 + 4}
            y={storeY + 12}
            width={10}
            height={10}
            rx={2}
            className={`transition-colors duration-300 ${stored(a) ? "fill-purple" : "fill-surface-2"}`}
          />
        ))}

        {/* output */}
        <rect
          x={0.5}
          y={outY + 0.5}
          width={W - 1}
          height={27}
          rx={5}
          className={`transition-colors duration-300 ${phase === "combine" || phase === "done" ? "fill-marker stroke-text" : "fill-surface stroke-line"}`}
        />
        <text x={W / 2} y={outY + 18} textAnchor="middle" className={`text-[12px] ${phase === "combine" || phase === "done" ? "fill-text font-semibold" : "fill-muted"}`}>
          {output}
        </text>

        {/* moving packets */}
        {Array.from({ length: Math.max(maxRound, 1) }, (_, i) => (
          <circle
            key={i}
            ref={(el) => {
              packets.current[i] = el;
            }}
            r={4.5}
            opacity={0}
            className={phase === "reply" ? "fill-success" : "fill-purple"}
          />
        ))}
      </svg>
    </div>
  );
}
