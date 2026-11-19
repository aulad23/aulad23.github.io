import Section from "./Section";
import { allReposUrl, projects, repoUrl } from "@/data/repos";

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={<>Things I&apos;ve <em>built</em>.</>}
      intro="Agent systems, scrapers and data tools — most of them built for real work with real deadlines."
    >
      <ol className="border-t border-text">
        {projects.map((p, i) => (
          <li key={p.name} className="grid gap-x-8 gap-y-3 border-b border-line py-8 sm:grid-cols-[48px_1fr_1.5fr]">
            <span className="font-serif text-xl text-muted">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-serif text-[1.85rem] leading-tight">{p.title}</h3>
            <div>
              <p className="leading-relaxed">{p.description}</p>
              <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-muted">
                {p.details.map((d) => (
                  <li key={d} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-purple">–</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">{[p.language, ...p.tags].join(" · ")}</p>
              {p.private ? (
                <a href="#contact" className="ink-link mt-4 inline-block pb-0.5 text-[15px] font-semibold text-muted">
                  Code available on request →<span className="sr-only"> for {p.title}</span>
                </a>
              ) : (
                <a
                  href={repoUrl(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ink-link mt-4 inline-block pb-0.5 text-[15px] font-semibold text-purple"
                >
                  View on GitHub →<span className="sr-only"> {p.title}</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
      <a href={allReposUrl} target="_blank" rel="noopener noreferrer" className="ink-link mt-10 inline-block pb-0.5 font-semibold">
        All repositories on GitHub →
      </a>
    </Section>
  );
}
