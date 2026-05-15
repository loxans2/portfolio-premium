import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const schema = z.object({
  reason: z.string().min(2).max(200),
  details: z.string().max(2000).optional(),
});

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
    return NextResponse.json({ error: "Motif invalide" }, { status: 400 });

  const resource = await prisma.resource.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });
  if (!resource)
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });

  await prisma.report.create({
    data: {
      userId: user.id,
      resourceId: resource.id,
      reason: parsed.data.reason,
      details: parsed.data.details ?? null,
    },
  });
  return NextResponse.json({ ok: true });
}
