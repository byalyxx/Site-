"use client";

import { useState } from "react";
import { cn } from "./cn";
import { bracketClass } from "./controls";

// A rule under each field instead of a box, in the link underline's colour (30% of the text), red on focus.
const fieldClass =
  "w-full rounded-none border-0 border-b border-b-site-fg/30 bg-transparent px-0 text-copy text-site-fg placeholder:text-site-muted site-transition focus-visible:border-b-site-brand focus-visible:outline-none";

// Styled and working in the browser, but not connected to any mailing list yet.
export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center rounded-control border border-site-border bg-site-surface p-1 pl-0 focus-within:border-site-muted">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Your email"
          className="h-field min-w-0 flex-1 bg-transparent px-3 text-copy text-site-fg placeholder:text-site-muted focus:outline-none"
        />
        <button
          type="submit"
          className="h-control shrink-0 rounded-control bg-site-bg px-4 text-copy font-semibold text-site-fg site-transition hover:bg-site-line"
        >
          Subscribe
        </button>
      </div>
      <p className="text-small text-site-muted" aria-live="polite">
        {sent ? "Thanks! Sign-ups aren’t switched on yet, so nothing was sent." : ""}
      </p>
    </form>
  );
}

// No form backend yet: submitting opens the visitor's email app with the message filled in.
export function ContactForm({ email }: { email: string }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const subject = `Collaboration enquiry from ${data.get("name")}`;
        const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("from")}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }}
      className="flex flex-col gap-4"
    >
      <Field id="contact-name" label="Name or brand">
        <input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Name or brand"
          className={cn(fieldClass, "h-field")}
        />
      </Field>
      <Field id="contact-email" label="Email address">
        <input
          id="contact-email"
          name="from"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className={cn(fieldClass, "h-field")}
        />
      </Field>
      <Field id="contact-message" label="Your message">
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="What would you like to work on?"
          className={cn(fieldClass, "resize-y py-2.5")}
        />
      </Field>
      <button type="submit" className={cn(bracketClass, "self-start")}>
        Submit
      </button>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
    </div>
  );
}
