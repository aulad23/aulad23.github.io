import { contact } from "@/data/site";
import ContactForm from "./ContactForm";

export default function Contact() {
  const links = [
    contact.linkedin && { label: "LinkedIn", href: contact.linkedin },
    contact.github && { label: "GitHub", href: contact.github },
    contact.facebook && { label: "Facebook", href: contact.facebook },
    contact.whatsapp && { label: "WhatsApp", href: contact.whatsapp },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="bg-text px-6 py-14 text-bg sm:px-14 sm:py-20">
          <p className="mb-4 font-hand text-[1.8rem] leading-none text-marker">got a website full of data?</p>
          <h2 id="contact-title" className="max-w-3xl font-serif text-[2.8rem] leading-[1.03] sm:text-[4.2rem]">
            Let&apos;s <em>work together</em>.
          </h2>
          <div className="mt-6 grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-14">
            <div>
              <p className="max-w-xl text-lg leading-relaxed text-bg/75">
                Need product data extracted, a scraper automated, or a dataset checked before delivery? Write to me — I
                read every message and reply myself.
              </p>

              {contact.email && (
                <div className="mt-10">
                  <p className="text-bg/60">Prefer email?</p>
                  {/* opens Gmail's compose window with the address filled in; the address itself isn't shown */}
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-serif text-[1.45rem] leading-tight underline decoration-marker decoration-2 underline-offset-[6px] transition-colors hover:text-marker sm:text-[1.8rem]"
                  >
                    Send me an email ↗<span className="sr-only"> (opens Gmail in a new tab)</span>
                  </a>
                </div>
              )}

              <div className="mt-10 border-t border-bg/20 pt-6">
                <p className="text-bg/60">Find me on</p>
                <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="ink-link pb-0.5 text-bg/90 hover:text-bg">
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {contact.formKey && <ContactForm />}
          </div>
        </div>
      </div>
    </section>
  );
}
