"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error("Non autorisé");
}

export async function markRead(id: string, read: boolean) {
  await requireAuth();
  await prisma.message.update({ where: { id }, data: { read } });
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAuth();
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}
