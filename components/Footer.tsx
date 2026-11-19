import { site } from "@/data/site";
import Year from "./Year";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-5 pb-12 sm:px-8">
      <div className="flex flex-col gap-3 border-t border-line pt-6 text-[15px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <Year /> {site.name} · Python developer, web scraping & automation.
        </p>
        <a href="#home" className="ink-link self-start pb-0.5 sm:self-auto">
          Back to top ↑
        </a>
      </div>
      <p className="mt-6 font-hand text-2xl text-muted">Thanks for scrolling all the way down.</p>
    </footer>
  );
}
