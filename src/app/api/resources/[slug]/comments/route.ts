import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  body: z.string().min(2).max(2000),
  rating: z.number().int().min(0).max(5),
});

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const resource = await prisma.resource.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!resource) return NextResponse.json([]);

  const comments = await prisma.comment.findMany({
    where: { resourceId: resource.id, approved: true },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { name: true, email: true, avatar: true } },
    },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user)
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const resource = await prisma.resource.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!resource)
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      userId: user.id,
      resourceId: resource.id,
      body: parsed.data.body,
      rating: parsed.data.rating,
    },
    include: { user: { select: { name: true, email: true, avatar: true } } },
  });

  // Recompute average rating
  if (parsed.data.rating > 0) {
    const agg = await prisma.comment.aggregate({
      where: { resourceId: resource.id, approved: true, rating: { gt: 0 } },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.resource.update({
      where: { id: resource.id },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });
  }

  return NextResponse.json(comment, { status: 201 });
}
