import Link from "next/link";
import { Plus, Search, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ResourcesAdminTable } from "./resources-admin-table";

export const dynamic = "force-dynamic";

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const where: any = {};
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { slug: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }

  const resources = await prisma.resource
    .findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    .catch(() => []);

  return (
    <div className="max-w-7xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">
            Ressources
          </h1>
          <p className="mt-2 text-muted-foreground">
            {resources.length} ressource{resources.length > 1 && "s"}
          </p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/resources/new">
            <Plus size={16} /> Nouvelle ressource
          </Link>
        </Button>
      </div>

      <ResourcesAdminTable resources={resources as any} />
    </div>
  );
}
