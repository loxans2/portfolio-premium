import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { canAccess } from "@/lib/utils";
import { signCloudinaryUrl } from "@/lib/cloudinary";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user)
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  const resource = await prisma.resource.findUnique({
    where: { slug: params.slug },
  });
  if (!resource || resource.status !== "PUBLISHED")
    return NextResponse.json(
      { error: "Ressource introuvable" },
      { status: 404 },
    );

  if (!canAccess(user.plan, resource.access)) {
    return NextResponse.json(
      {
        error: "Abonnement requis",
        required: resource.access,
      },
      { status: 403 },
    );
  }

  if (!resource.fileUrl) {
    return NextResponse.json(
      { error: "Fichier indisponible" },
      { status: 404 },
    );
  }

  // Quota free : 5/mois
  if (user.plan === "FREE") {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const count = await prisma.download.count({
      where: { userId: user.id, createdAt: { gte: since } },
    });
    if (count >= 5) {
      return NextResponse.json(
        {
          error:
            "Quota gratuit atteint (5/mois). Passez Premium pour téléchargements illimités.",
        },
        { status: 429 },
      );
    }
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    null;

  await prisma.$transaction([
    prisma.download.create({
      data: {
        userId: user.id,
        resourceId: resource.id,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") ?? null,
      },
    }),
    prisma.resource.update({
      where: { id: resource.id },
      data: { downloads: { increment: 1 } },
    }),
  ]);

  // Signed URL (15 min) si fichier Cloudinary, sinon URL brute
  const signed = signCloudinaryUrl(resource.fileUrl, 60 * 15);

  return NextResponse.json({ url: signed ?? resource.fileUrl });
}
