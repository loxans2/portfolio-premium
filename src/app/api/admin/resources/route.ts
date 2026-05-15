import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions, isAdminRole } from "@/lib/auth";
import { RESOURCE_ACCESS, RESOURCE_CATEGORIES, slugify } from "@/lib/utils";

const upsertSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  category: z.enum(RESOURCE_CATEGORIES as any),
  access: z.enum(RESOURCE_ACCESS as any),
  excerpt: z.string().min(1),
  description: z.string().min(1),
  coverImage: z.string().min(1),
  images: z.array(z.string()).default([]),
  fileUrl: z.string().nullable().optional(),
  fileSize: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED"]),
  order: z.number().int().default(0),
  price: z.number().optional().nullable(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || !isAdminRole(user.role)) return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (!data.slug) data.slug = slugify(data.title);

  try {
    const created = await prisma.resource.create({
      data: {
        ...data,
        fileUrl: data.fileUrl || null,
        fileSize: data.fileSize || null,
        version: data.version || null,
        license: data.license || null,
        price: data.price ?? 0,
        authorId: user.id,
      },
    });
    return NextResponse.json(created, { status: 201 });
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
