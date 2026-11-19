import { site } from "@/data/site";
import ProfilePhoto from "./ProfilePhoto";

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="mx-auto grid max-w-5xl items-center gap-14 px-5 sm:px-8 md:grid-cols-[1.35fr_1fr]">
        <div className="reveal">
          <p className="mb-5 text-[15px] font-medium text-muted">
            Aulad Hossain · Python Developer · Dhaka, Bangladesh
          </p>
          <h1 id="hero-title" className="text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[3.4rem]">
            I build reliable web scrapers, data pipelines and AI agents.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            I extract structured product data from websites, clean and validate it, and deliver it ready to use. I
            also build multi-agent systems with Claude Code and MCP to automate that work.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href="#projects" className="lift rounded-full bg-text px-6 py-3 font-semibold text-bg">
              View my work
            </a>
            <a href="#contact" className="ink-link pb-0.5 font-semibold">
              Get in touch →
            </a>
          </div>

          <p className="mt-12 max-w-lg text-[15px] leading-relaxed text-muted">
            <span className="font-semibold text-text">Tools I use: </span>
            {site.heroChips.join(", ")}.
          </p>
        </div>

        <div className="reveal relative mx-auto w-full max-w-[320px] [animation-delay:120ms] md:max-w-none">
          <div className="rotate-[2deg]">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 -rotate-3 bg-[#f5e7b8]/80 shadow-sm"
            />
            <div className="bg-surface p-3 shadow-[0_1px_2px_rgb(0_0_0/0.08),0_12px_30px_-10px_rgb(60_45_20/0.35)]">
              <ProfilePhoto />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
