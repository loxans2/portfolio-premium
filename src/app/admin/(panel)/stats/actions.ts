"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error("Non autorisé");
}

const schema = z.object({
  label: z.string().min(1).max(120),
  value: z.coerce.number().int().min(0),
  suffix: z.string().max(8).optional().nullable(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

function parse(fd: FormData) {
  return schema.parse({
    label: fd.get("label"),
    value: fd.get("value"),
    suffix: (fd.get("suffix") as string) || "",
    order: fd.get("order") || 0,
    published: fd.get("published") !== "off",
  });
}

export async function createStat(fd: FormData) {
  await requireAuth();
  await prisma.stat.create({ data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/admin/stats");
}

export async function updateStat(id: string, fd: FormData) {
  await requireAuth();
  await prisma.stat.update({ where: { id }, data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/admin/stats");
}

export async function deleteStat(id: string) {
  await requireAuth();
  await prisma.stat.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/stats");
}
