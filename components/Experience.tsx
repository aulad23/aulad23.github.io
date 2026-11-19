import Section from "./Section";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title={<>Where I <em>work</em>.</>}>
      <ol className="border-t border-text">
        {experience.map((item) => (
          <li
            key={`${item.company}-${item.role}`}
            className="grid gap-x-8 gap-y-1 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:items-baseline"
          >
            <div>
              <h3 className="font-serif text-[1.9rem] leading-tight">{item.role}</h3>
              <p className="mt-1 text-muted">
                {item.company} · {item.team}
              </p>
              {item.details && item.details.length > 0 && (
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-muted">
                  {item.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
            {item.period && <span className="text-muted">{item.period}</span>}
          </li>
        ))}
      </ol>
    </Section>
  );
}
