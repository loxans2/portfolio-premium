import { prisma } from "@/lib/prisma";
import { StatsEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const stats = await prisma.stat
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Statistiques
      </h1>
      <p className="mt-2 text-muted-foreground">
        Compteurs animés affichés sur la home (projets livrés, années
        d'expérience, etc.).
      </p>
      <div className="mt-10">
        <StatsEditor stats={stats} />
      </div>
    </div>
  );
}
