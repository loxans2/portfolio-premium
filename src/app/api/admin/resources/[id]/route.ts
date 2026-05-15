import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions, isAdminRole } from "@/lib/auth";
import { RESOURCE_ACCESS, RESOURCE_CATEGORIES } from "@/lib/utils";

const updateSchema = z
  .object({
    slug: z.string().min(2),
    title: z.string().min(2),
    category: z.enum(RESOURCE_CATEGORIES as any),
    access: z.enum(RESOURCE_ACCESS as any),
    excerpt: z.string().min(1),
    description: z.string().min(1),
    coverImage: z.string().min(1),
    images: z.array(z.string()),
    fileUrl: z.string().nullable().optional(),
    fileSize: z.string().nullable().optional(),
    version: z.string().nullable().optional(),
    license: z.string().nullable().optional(),
    tags: z.array(z.string()),
    featured: z.boolean(),
    status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED"]),
    order: z.number().int(),
    price: z.number().optional().nullable(),
  })
  .partial();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || !isAdminRole(user.role)) return null;
  return user;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireAdmin();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const data: any = { ...parsed.data };
    if (data.fileUrl === "") data.fileUrl = null;
    if (data.fileSize === "") data.fileSize = null;
    if (data.version === "") data.version = null;
    if (data.license === "") data.license = null;
    const updated = await prisma.resource.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Ce slug existe déjà." },
        { status: 409 },
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  return PUT(req, { params });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const user = await requireAdmin();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    await prisma.resource.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Suppression impossible" }, { status: 500 });
  }
}
