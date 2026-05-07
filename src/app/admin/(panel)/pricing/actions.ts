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
  name: z.string().min(1).max(120),
  price: z.string().min(1).max(40),
  priceSuffix: z.string().max(40).optional().nullable(),
  description: z.string().min(1).max(400),
  features: z.array(z.string()).default([]),
  cta: z.string().min(1).max(60).default("Démarrer"),
  ctaUrl: z.string().min(1).max(300).default("/contact"),
  highlighted: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

function parse(fd: FormData) {
  const featuresRaw = (fd.get("features") as string) || "";
  const features = featuresRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return schema.parse({
    name: fd.get("name"),
    price: fd.get("price"),
    priceSuffix: (fd.get("priceSuffix") as string) || "",
    description: fd.get("description"),
    features,
    cta: (fd.get("cta") as string) || "Démarrer",
    ctaUrl: (fd.get("ctaUrl") as string) || "/contact",
    highlighted: fd.get("highlighted") === "on",
    order: fd.get("order") || 0,
    published: fd.get("published") !== "off",
  });
}

export async function createPlan(fd: FormData) {
  await requireAuth();
  await prisma.pricingPlan.create({ data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/tarifs");
  revalidatePath("/admin/pricing");
}

export async function updatePlan(id: string, fd: FormData) {
  await requireAuth();
  await prisma.pricingPlan.update({ where: { id }, data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/tarifs");
  revalidatePath("/admin/pricing");
}

export async function deletePlan(id: string) {
  await requireAuth();
  await prisma.pricingPlan.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/tarifs");
  revalidatePath("/admin/pricing");
}
