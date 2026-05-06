"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  behance: z.string().url().optional().or(z.literal("")),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  aboutTitle: z.string().min(1),
  aboutBody: z.string().min(1),
});

export async function updateSettings(fd: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Non autorisé");
  const data = schema.parse({
    siteName: fd.get("siteName"),
    tagline: fd.get("tagline"),
    bio: fd.get("bio"),
    email: fd.get("email"),
    phone: (fd.get("phone") as string) || "",
    location: (fd.get("location") as string) || "",
    instagram: (fd.get("instagram") as string) || "",
    linkedin: (fd.get("linkedin") as string) || "",
    github: (fd.get("github") as string) || "",
    behance: (fd.get("behance") as string) || "",
    heroTitle: fd.get("heroTitle"),
    heroSubtitle: fd.get("heroSubtitle"),
    aboutTitle: fd.get("aboutTitle"),
    aboutBody: fd.get("aboutBody"),
  });
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      ...data,
      phone: data.phone || null,
      location: data.location || null,
      instagram: data.instagram || null,
      linkedin: data.linkedin || null,
      github: data.github || null,
      behance: data.behance || null,
    },
    create: {
      id: "singleton",
      ...data,
      phone: data.phone || null,
      location: data.location || null,
      instagram: data.instagram || null,
      linkedin: data.linkedin || null,
      github: data.github || null,
      behance: data.behance || null,
    },
  });
  revalidatePath("/", "layout");
}
