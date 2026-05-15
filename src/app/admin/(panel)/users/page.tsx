import { prisma } from "@/lib/prisma";
import { UsersAdminTable } from "./users-admin-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string; plan?: string };
}) {
  const where: any = {};
  if (searchParams.q) {
    where.OR = [
      { email: { contains: searchParams.q, mode: "insensitive" } },
      { name: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  if (searchParams.role) where.role = searchParams.role;
  if (searchParams.plan) where.plan = searchParams.plan;

  const users = await prisma.user
    .findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        createdAt: true,
        _count: { select: { downloads: true, favorites: true } },
      },
    })
    .catch(() => []);

  return (
    <div className="max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">
          Utilisateurs
        </h1>
        <p className="mt-2 text-muted-foreground">
          {users.length} compte{users.length > 1 && "s"}
        </p>
      </div>
      <UsersAdminTable users={users as any} />
    </div>
  );
}
