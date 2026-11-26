"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/data/site";

// Inline contact form in the (dark) Contact section. Messages are delivered to contact.email
// by Web3Forms, since a static site can't send mail by itself.
type Status = { kind: "idle" | "working" | "error" | "done"; message?: string };

const field =
  "w-full rounded-xl border border-bg/25 bg-bg/5 px-4 py-3 text-base text-bg [color-scheme:dark] placeholder:text-bg/40 focus:border-marker focus:outline-none";
const label = "flex flex-col gap-1.5 text-sm";
const labelText = "text-bg/70";
const MAX_WORDS = 500;
const countWords = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [today, setToday] = useState("");
  const [words, setWords] = useState(0);

  // earliest selectable date = the visitor's today (set after load; static HTML can't know it)
  useEffect(() => {
    const d = new Date();
    setToday(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("botcheck")) return; // hidden field filled in → a bot

    const get = (k: string) => String(data.get(k) ?? "").trim();
    const name = get("name");
    const email = get("email");
    const message = get("message");
    const date = get("date");
    const time = get("time");
    if (!name || !email || !message) return setStatus({ kind: "error", message: "Please fill in name, email and message." });
    if (countWords(message) > MAX_WORDS)
      return setStatus({ kind: "error", message: `Please keep the message under ${MAX_WORDS} words.` });

    let zone = "";
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      /* unknown time zone */
    }
    const when = [date, time].filter(Boolean).join(" at ");

    setStatus({ kind: "working", message: "Sending…" });
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: contact.formKey,
          subject: `Portfolio message from ${name}`,
          from_name: "Portfolio contact form",
          name,
          email,
          replyto: email,
          "Preferred date & time": when ? `${when}${zone ? ` (${zone})` : ""}` : "Not specified",
          message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      formRef.current?.reset();
      setWords(0);
      setStatus({ kind: "done", message: "Thanks — your message has been sent. I'll reply to your email soon." });
    } catch {
      setStatus({
        kind: "error",
        message: "The message could not be sent. Please try again, or use “Send me an email”.",
      });
    }
  }

  const working = status.kind === "working";

  return (
    <form ref={formRef} onSubmit={onSubmit} aria-label="Contact form" className="flex flex-col gap-4">
      <label className={label}>
        <span className={labelText}>Name</span>
        <input name="name" required maxLength={100} autoComplete="name" className={field} />
      </label>
      <label className={label}>
        <span className={labelText}>Email</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
      </label>

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className={`mb-1.5 text-sm ${labelText}`}>When would you like to talk? (optional)</legend>
        <label className={label}>
          <span className="sr-only">Preferred date</span>
          <input name="date" type="date" min={today || undefined} className={field} />
        </label>
        <label className={label}>
          <span className="sr-only">Preferred time</span>
          <input name="time" type="time" className={field} />
        </label>
      </fieldset>

      <label className={label}>
        <span className="flex justify-between gap-3">
          <span className={labelText}>Message</span>
          <span id="message-count" aria-live="polite" className={words > MAX_WORDS ? "text-red-200" : "text-bg/50"}>
            {words} / {MAX_WORDS} words
          </span>
        </span>
        <textarea
          name="message"
          required
          rows={3}
          maxLength={MAX_WORDS * 12}
          aria-describedby="message-count"
          onChange={(e) => setWords(countWords(e.target.value))}
          className={`${field} resize-y`}
        />
      </label>
      {/* honeypot: hidden from people, bots fill it in */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {status.message && (
        <p
          role={status.kind === "error" ? "alert" : "status"}
          className={`rounded-xl px-4 py-3 text-sm ${
            status.kind === "error" ? "bg-red-400/15 text-red-200" : "bg-bg/10 text-bg"
          }`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={working}
        className="lift mt-1 self-start rounded-full bg-bg px-6 py-3 font-semibold text-text disabled:opacity-60"
      >
        {working ? "Sending…" : "Contact me"}
      </button>
    </form>
  );
}
