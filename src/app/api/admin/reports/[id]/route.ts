import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions, isAdminRole } from "@/lib/auth";

const schema = z.object({ resolved: z.boolean() });

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || !isAdminRole(user.role))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  await prisma.report.update({
    where: { id: params.id },
    data: { resolved: parsed.data.resolved },
  });
  return NextResponse.json({ ok: true });
}
