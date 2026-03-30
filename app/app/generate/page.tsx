import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function GeneratePage() {
  return (
    <PageShell>
      <section className="space-y-4 rounded-3xl border border-emerald-900/15 bg-white/90 p-6 shadow-[0_16px_44px_-24px_rgba(12,64,42,0.45)] animate-fade-up">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/70">QR Builder</p>
        <h1 className="text-3xl font-display text-emerald-950">QR generation is disabled</h1>
        <p className="text-sm leading-relaxed text-emerald-900/80">
          Existing QR codes remain active and continue to open their plant profile endpoints.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full bg-emerald-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-50 transition hover:bg-emerald-950"
        >
          Back to Home
        </Link>
      </section>
    </PageShell>
  );
}
