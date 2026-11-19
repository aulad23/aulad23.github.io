import Section from "./Section";
import { workflow } from "@/data/experience";

export default function Workflow() {
  return (
    <Section id="workflow" eyebrow="How I work" title={<>Five steps, <em>every time</em>.</>}>
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {workflow.map((w) => (
          <li key={w.stage} className="border-t-2 border-text pt-4">
            <span className="font-hand text-3xl leading-none text-purple">{Number(w.stage)}.</span>
            <h3 className="mt-2 font-serif text-[1.65rem] leading-tight">{w.name}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{w.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
