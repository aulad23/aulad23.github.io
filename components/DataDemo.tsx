"use client";

import { useState } from "react";
import Section from "./Section";

// A small interactive illustration of the scrape → structure → validate flow.
// The product is a made-up example, not real client data.
const steps = [
  { id: "page", label: "1. Product page" },
  { id: "data", label: "2. Extracted data" },
  { id: "checks", label: "3. Validated" },
] as const;
type Step = (typeof steps)[number]["id"];

const json: [string, string, "str" | "num" | "arr"][] = [
  ["title", '"Walnut Side Table"', "str"],
  ["sku", '"WST-2041"', "str"],
  ["price", "420.00", "num"],
  ["currency", '"USD"', "str"],
  ["width_in", "22", "num"],
  ["height_in", "24", "num"],
  ["finish", '["Walnut", "Ebony"]', "arr"],
  ["image", '"https://…/wst-2041.jpg"', "str"],
];

const checks = [
  { ok: true, text: "Required fields present" },
  { ok: true, text: "SKU is unique" },
  { ok: true, text: "Price is a valid number" },
  { ok: true, text: "Dimensions in inches" },
  { ok: false, text: "Description missing — flagged for review" },
];

export default function DataDemo() {
  const [step, setStep] = useState<Step>("page");

  return (
    <Section
      id="demo"
      eyebrow="See it in action"
      title={<>From a messy web page to <em>clean, checked</em> data.</>}
      intro="Click through the three steps. This is a made-up product, but it is the same flow I use on real vendor sites."
    >
      <div className="card overflow-hidden">
        <div role="tablist" aria-label="Scraping steps" className="flex flex-wrap gap-2 border-b border-line bg-bg/40 p-3">
          {steps.map((s) => (
            <button
              key={s.id}
              role="tab"
              type="button"
              id={`tab-${s.id}`}
              aria-selected={step === s.id}
              aria-controls="demo-panel"
              onClick={() => setStep(s.id)}
              className={`lift rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                step === s.id ? "bg-purple text-bg" : "text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div id="demo-panel" role="tabpanel" aria-labelledby={`tab-${step}`} className="min-h-[340px] p-5 sm:p-8">
          {step === "page" && (
            <div key="page" className="pop grid gap-6 sm:grid-cols-[220px_1fr]">
              <div aria-hidden="true" className="flex aspect-square items-end justify-center rounded-lg bg-surface-2 p-6">
                <div className="flex w-full flex-col items-center">
                  <div className="h-3 w-4/5 rounded-full bg-[#8b6b4f]" />
                  <div className="flex w-3/5 justify-between">
                    <div className="h-24 w-2 bg-[#8b6b4f]" />
                    <div className="h-24 w-2 bg-[#8b6b4f]" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-muted">Home / Furniture / Tables</p>
                <h3 className="font-serif text-3xl">Walnut Side Table</h3>
                <p className="text-xl">$420.00</p>
                <p className="text-sm text-muted">Item #WST-2041 · 22&quot; W × 24&quot; H</p>
                <div className="flex gap-2 text-sm">
                  <span className="rounded-md border border-purple px-3 py-1">Walnut</span>
                  <span className="rounded-md border border-line px-3 py-1 text-muted">Ebony</span>
                </div>
                <p className="pt-2 text-sm text-muted">
                  Everything a person can read — but a spreadsheet can&apos;t use it yet.
                </p>
              </div>
            </div>
          )}

          {step === "data" && (
            <pre key="data" className="pop overflow-x-auto rounded-md bg-text p-5 font-mono text-sm leading-7 text-bg">
              <code>
                {"{\n"}
                {json.map(([k, v, t], i) => (
                  <span key={k}>
                    {"  "}
                    <span className="text-[#9ec5ff]">&quot;{k}&quot;</span>:{" "}
                    <span className={t === "num" ? "text-marker" : t === "arr" ? "text-[#cbbcff]" : "text-[#b5e3a1]"}>{v}</span>
                    {i < json.length - 1 ? ",\n" : "\n"}
                  </span>
                ))}
                {"}"}
              </code>
            </pre>
          )}

          {step === "checks" && (
            <ul key="checks" className="pop space-y-3">
              {checks.map((c) => (
                <li key={c.text} className="flex items-center gap-3 rounded-lg border border-line bg-bg/50 px-4 py-3">
                  <span
                    aria-hidden="true"
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      c.ok ? "bg-success/15 text-success" : "bg-marker text-[#7a5200]"
                    }`}
                  >
                    {c.ok ? "✓" : "!"}
                  </span>
                  <span className={c.ok ? "" : "font-semibold text-[#7a5200]"}>
                    <span className="sr-only">{c.ok ? "Passed: " : "Needs review: "}</span>
                    {c.text}
                  </span>
                </li>
              ))}
              <li className="pt-2 text-sm text-muted">
                Issues are reported, not hidden — so the delivered file can be trusted.
              </li>
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
