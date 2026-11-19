import Section from "./Section";
import { journey } from "@/data/experience";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title={<>A little about <em>me</em>.</>}>
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-[1.15rem] leading-[1.75]">
          <p>
            I&apos;m a Python developer who works on web scraping, automation and product data. Most days I&apos;m
            pulling structured product information out of vendor websites — handling the dynamic pages, cleaning and
            organizing what comes out, and checking it before anyone else sees it.
          </p>
          <p>
            I also build multi-agent systems with Claude Code: several agents working on one job, each with its own
            role, connected to tools and data through <span className="marker">MCP (Model Context Protocol)</span>.
          </p>
          <p className="text-muted">
            What I care about most is simple: workflows that don&apos;t break, scraping logic the next person can
            read, and data that is actually right.
          </p>
        </div>

        <aside aria-labelledby="journey-title" className="border-l-2 border-text pl-6">
          <h3 id="journey-title" className="mb-4 font-hand text-[1.7rem] leading-none text-purple">
            how I got here
          </h3>
          <ol className="space-y-4">
            {journey.map((step, i) => (
              <li key={step} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="font-serif text-xl leading-6 text-muted">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Section>
  );
}
