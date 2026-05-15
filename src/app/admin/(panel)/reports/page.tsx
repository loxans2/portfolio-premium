import { prisma } from "@/lib/prisma";
import { ReportsAdminTable } from "./reports-admin-table";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { filter?: "open" | "resolved" | "all" };
}) {
  const filter = searchParams.filter ?? "open";
  const where: any = {};
  if (filter === "open") where.resolved = false;
  if (filter === "resolved") where.resolved = true;

  const reports = await prisma.report
    .findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { email: true, name: true } },
        resource: { select: { id: true, slug: true, title: true } },
      },
    })
    .catch(() => []);

  return (
    <div className="max-w-7xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">
            Signalements
          </h1>
          <p className="mt-2 text-muted-foreground">
            {reports.length} signalement{reports.length > 1 && "s"}{" "}
            {filter === "open" ? "en attente" : filter === "resolved" ? "résolu" : ""}
          </p>
        </div>
      </div>

      <ReportsAdminTable reports={reports as any} filter={filter} />
    </div>
  );
}
