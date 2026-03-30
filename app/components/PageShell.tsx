import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_10%,#efffd8_0%,#eef8e6_26%,#ecf4ef_55%,#edf3ef_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(21,77,47,0.08),transparent_42%,rgba(149,183,109,0.12)_80%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-size:20px_20px] [background-image:linear-gradient(to_right,rgba(18,58,36,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(18,58,36,0.08)_1px,transparent_1px)]" />
      <main className="relative mx-auto flex w-full max-w-xl flex-col px-4 pb-16 pt-6 sm:px-6 sm:pt-8 md:max-w-3xl lg:max-w-4xl">
        {children}
      </main>
    </div>
  );
}
