type PlantMetaRowProps = {
  label: string;
  value: string;
};

export default function PlantMetaRow({ label, value }: PlantMetaRowProps) {
  return (
    <div className="rounded-xl border border-emerald-900/10 bg-white/80 p-3 backdrop-blur-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-emerald-900/55">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-950">{value}</p>
    </div>
  );
}
