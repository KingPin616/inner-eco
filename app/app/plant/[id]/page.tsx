import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PlantMetaRow from "@/components/PlantMetaRow";
import { getPlantById } from "@/utils/plants";
import { getRuntimePlantById } from "@/utils/runtimePlants";

type PlantPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlantPage({ params }: PlantPageProps) {
  const { id } = await params;
  const runtimePlant = await getRuntimePlantById(id);
  const plant =
    getPlantById(id) ??
    runtimePlant ?? {
      id,
      name: {
        common: id.replaceAll("-", " "),
        scientific: "Unknown species",
      },
      age: "Unknown age",
      description:
        "This plant ID does not exist in static data yet. Create it from the QR Builder to save full details.",
      imageUrl: "/image/oak-001.svg",
    };

  return (
    <PageShell>
      <header className="mb-6 animate-fade-up">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-900 backdrop-blur-sm transition hover:bg-white"
        >
          Back
        </Link>
      </header>

      <article className="animate-fade-up overflow-hidden rounded-[2rem] border border-emerald-900/15 bg-white/90 shadow-[0_22px_70px_-28px_rgba(11,67,41,0.55)] backdrop-blur-sm [animation-delay:120ms]">
        <div className="relative h-60 w-full sm:h-72">
          <Image
            src={plant.imageUrl}
            alt={plant.name.common}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-emerald-950/10 to-transparent" />
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          {plant.name.scientific === "Unknown species" ? (
            <p className="rounded-xl border border-amber-900/25 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              Showing temporary profile for unknown plant ID.
            </p>
          ) : null}

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800/80">Plant Profile</p>
            <h1 data-testid="plant-name" className="text-4xl font-display leading-[0.92] text-emerald-950 sm:text-5xl">
              {plant.name.common}
            </h1>
            <p className="text-sm italic text-emerald-900/75 sm:text-base">{plant.name.scientific}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PlantMetaRow label="Age" value={plant.age} />
            <PlantMetaRow label="ID" value={plant.id} />
          </div>

          <p className="text-[0.98rem] leading-relaxed text-emerald-950/88">{plant.description}</p>
        </div>
      </article>
    </PageShell>
  );
}
