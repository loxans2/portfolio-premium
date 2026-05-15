import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions, isAdminRole } from "@/lib/auth";

const schema = z.object({
  role: z.enum(["USER", "CONTRIBUTOR", "MODERATOR", "ADMIN"]).optional(),
  plan: z.enum(["FREE", "PREMIUM", "VIP"]).optional(),
  name: z.string().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: parsed.data,
      select: { id: true, role: true, plan: true, name: true, email: true },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (params.id === admin.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte." },
      { status: 400 },
    );
  }

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
