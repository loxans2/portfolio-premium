import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user)
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  const resource = await prisma.resource.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!resource)
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_resourceId: { userId: user.id, resourceId: resource.id } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({
    data: { userId: user.id, resourceId: resource.id },
  });
  return NextResponse.json({ favorited: true });
}
