import Link from "next/link";
import PageShell from "@/components/PageShell";
import PlantCard from "@/components/PlantCard";
import { getPlants } from "@/utils/plants";

export default function Home() {
  const plants = getPlants();

  return (
    <PageShell>
      <section className="space-y-4 rounded-3xl border border-emerald-900/15 bg-white/85 p-5 shadow-[0_20px_64px_-30px_rgba(11,70,42,0.55)] backdrop-blur-sm animate-fade-up">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/70">
          Tree QR Companion
        </p>
        <h1 data-testid="home-title" className="text-4xl font-display leading-[0.92] text-emerald-950 sm:text-5xl">
          Scan in the park.
          <br />
          Learn in seconds.
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-emerald-900/80 sm:text-base">
          Each tagged tree opens an instant profile with age, scientific details, and a short description.
        </p>
        <Link
          href="/generate"
          className="inline-flex rounded-full bg-emerald-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-50 transition hover:bg-emerald-950"
        >
          Open QR Generator
        </Link>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        {plants.map((plant, index) => (
          <div key={plant.id} className="animate-fade-up" style={{ animationDelay: `${140 + index * 70}ms` }}>
            <PlantCard plant={plant} />
          </div>
        ))}
      </section>
    </PageShell>
  );
}
