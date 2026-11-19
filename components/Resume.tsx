import Section from "./Section";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const pdf = `${base}/resume/Aulad_Hossain_Resume.pdf`;
const docx = `${base}/resume/Aulad_Hossain_Resume.docx`;

export default function Resume() {
  return (
    <Section id="resume" eyebrow="Resume" title={<>My <em>resume</em>, on one page.</>}>
      <div className="grid gap-10 border-t border-text pt-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-[1.1rem] leading-relaxed">
            Summary, skills, experience, projects and education — in a simple one-page format that applicant tracking
            systems (ATS) can read correctly.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={pdf}
              download="Aulad_Hossain_Resume.pdf"
              className="lift inline-flex items-center gap-2 rounded-full bg-text px-6 py-3 font-semibold text-bg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
              </svg>
              Download Resume (PDF)
            </a>
            <a href={docx} download="Aulad_Hossain_Resume.docx" className="ink-link pb-0.5 font-semibold">
              Word version (.docx)
            </a>
            <a href={pdf} target="_blank" rel="noopener noreferrer" className="ink-link pb-0.5 font-semibold text-muted">
              Open in browser ↗
            </a>
          </div>
        </div>
        <ul className="space-y-2.5 text-[15px] text-muted">
          <li>– One page, single column, with photo</li>
          <li>– Standard section headings</li>
          <li>– Plain, selectable text — no tables or graphics</li>
          <li>– PDF and Word formats</li>
        </ul>
      </div>
    </Section>
  );
}
