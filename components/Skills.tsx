import Section from "./Section";
import { skillGroups } from "@/data/skills";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title={<>The tools on my <em>desk</em>.</>}>
      <dl className="divide-y divide-line border-y border-line">
        {skillGroups.map((group) => (
          <div key={group.category} className="grid gap-2 py-5 sm:grid-cols-[220px_1fr] sm:gap-8">
            <dt className="font-serif text-2xl leading-tight">{group.category}</dt>
            <dd className="self-center text-[1.05rem] leading-relaxed text-muted">{group.skills.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
