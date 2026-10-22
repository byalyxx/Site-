// Plain text blocks for /privacy and /terms.
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-body font-semibold text-site-fg">{title}</h2>
      <div className="flex flex-col gap-2 text-body text-site-muted">{children}</div>
    </section>
  );
}
