export const LEGAL_UPDATED = "November 8, 2026";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="legal space-y-5 pt-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted">Last updated: {LEGAL_UPDATED}</p>
      </div>
      {children}
    </article>
  );
}
