import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function PlantNotFound() {
  return (
    <PageShell>
      <section className="mx-auto mt-16 w-full max-w-lg rounded-3xl border border-amber-900/20 bg-white/90 p-8 text-center shadow-[0_18px_48px_-24px_rgba(58,45,22,0.45)] backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800/80">Unknown QR</p>
        <h1 className="mt-3 text-4xl font-display text-amber-950">Plant not found</h1>
        <p className="mt-4 text-sm text-amber-900/80">
          The scanned code does not match any plant in this catalog yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-amber-900 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-amber-50 transition hover:bg-amber-950"
        >
          Return Home
        </Link>
      </section>
    </PageShell>
  );
}
