type Props = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ id, eyebrow, title, intro, children, className = "" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-[15px] text-muted">— {eyebrow}</p>
          <h2 id={`${id}-title`} className="font-serif text-[2.6rem] leading-[1.05] tracking-[-0.01em] sm:text-[3.4rem]">
            {title}
          </h2>
          {intro && <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
