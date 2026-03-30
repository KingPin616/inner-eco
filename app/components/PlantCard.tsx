import Image from "next/image";
import Link from "next/link";
import type { Plant } from "@/utils/plants";

type PlantCardProps = {
  plant: Plant;
};

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-emerald-900/15 bg-white/90 shadow-[0_16px_42px_-20px_rgba(13,59,39,0.55)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-22px_rgba(13,59,39,0.65)]">
      <div className="relative h-40 w-full">
        <Image
          src={plant.imageUrl}
          alt={plant.name.common}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/35 via-transparent to-transparent" />
      </div>
      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h2 className="text-xl font-display leading-tight text-emerald-950">{plant.name.common}</h2>
          <p className="text-sm italic text-emerald-900/70">{plant.name.scientific}</p>
        </div>
        <p className="text-sm text-emerald-900/80">{plant.description}</p>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
            {plant.age}
          </span>
          <Link
            href={`/plant/${plant.id}`}
            className="rounded-full border border-emerald-900/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
          >
            Open Card
          </Link>
        </div>
      </div>
    </article>
  );
}
