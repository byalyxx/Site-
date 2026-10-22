"use client";

import { useState } from "react";
import { track } from "@/components/click-tracking";
import { cn } from "./cn";
import { bracketClass, fieldClass, linkClass } from "./controls";


// Enquiries go to Formspree (formspree.io), which emails them on. The form's ID comes from the
// NEXT_PUBLIC_FORMSPREE_FORM_ID environment variable (see README). Without it, submitting opens the visitor's
// email app with the message filled in, so an enquiry is never dropped silently.
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!FORM_ID) {
      const subject = `Collaboration enquiry from ${data.get("name")}`;
      const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("email")}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Formspree answered ${res.status}`);
      form.reset();
      setStatus("sent");
      track("Contact form sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="_subject" value="New enquiry from byalyxx.com" />
      {/* Honeypot: hidden from people, filled in by bots, and Formspree drops anything that has it */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
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
          name="email"
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
      <div>
        <button type="submit" className={bracketClass} disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Submit"}
        </button>
        {/* Empty (and so no height) until there is something to say */}
        <p className="mt-2 text-small text-site-muted empty:mt-0" aria-live="polite">
          {status === "sent" && "Thanks, your message is on its way. I’ll reply by email."}
          {status === "error" && (
            <>
              That didn’t send. Email{" "}
              <a href={`mailto:${email}`} className={cn(linkClass, "text-site-fg")}>
                {email}
              </a>{" "}
              instead.
            </>
          )}
        </p>
      </div>
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
