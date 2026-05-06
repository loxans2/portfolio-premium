import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, name: "Admin" },
  });

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Studio",
      tagline: "Sites premium, identités sur mesure.",
      bio: "Designer & développeur indépendant. Je crée des expériences digitales qui marquent.",
      email,
      heroTitle: "Création digitale & identité de marque.",
      heroSubtitle:
        "Je conçois des sites web sur mesure, des chartes graphiques et des logos qui racontent votre histoire.",
      aboutTitle: "À propos",
      aboutBody:
        "Designer indépendant passionné, j'aide les marques à se distinguer grâce à des identités visuelles fortes et des sites web pensés pour convertir. Chaque projet est unique et mérite une approche sur mesure.",
    },
  });

  const services = [
    {
      title: "Sites web sur mesure",
      description:
        "Vitrines, e-commerce, plateformes — pensés pour convertir, animés avec soin, performants sur tous écrans.",
      icon: "Code2",
      order: 1,
    },
    {
      title: "Identité de marque",
      description:
        "Charte graphique complète : logo, typographie, palette, déclinaisons. Une identité cohérente et mémorable.",
      icon: "Palette",
      order: 2,
    },
    {
      title: "Logo & branding",
      description:
        "Création de logos uniques, recherche graphique, déclinaisons print et digital. Un symbole qui vous représente.",
      icon: "Sparkles",
      order: 3,
    },
    {
      title: "Direction artistique",
      description:
        "Conseil et accompagnement créatif pour aligner votre univers visuel avec votre vision business.",
      icon: "Wand2",
      order: 4,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `seed-${s.order}` },
      update: s,
      create: { id: `seed-${s.order}`, ...s },
    });
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          slug: "restaurant-le-marais",
          title: "Restaurant Le Marais",
          category: "WEBSITE",
          excerpt: "Site vitrine pour un restaurant gastronomique parisien.",
          description:
            "Refonte complète de l'identité digitale d'un restaurant gastronomique. Hero immersif, carte interactive, réservation en ligne, animations sur mesure.",
          coverImage:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600",
          tags: ["Next.js", "Framer Motion", "Stripe"],
          client: "Le Marais",
          year: "2025",
          featured: true,
          order: 1,
        },
        {
          slug: "atelier-noir-branding",
          title: "Atelier Noir — Identité",
          category: "BRANDING",
          excerpt: "Charte graphique complète pour un atelier de céramique.",
          description:
            "Création d'une identité de marque minimaliste et raffinée pour un atelier de céramique haut de gamme. Logo, typographie, palette, supports print.",
          coverImage:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600",
          tags: ["Branding", "Print", "Identité"],
          client: "Atelier Noir",
          year: "2025",
          featured: true,
          order: 2,
        },
        {
          slug: "lumen-logo",
          title: "Lumen — Logo",
          category: "LOGO",
          excerpt: "Logo et symbole pour une startup tech.",
          description:
            "Conception d'un logo simple, modulaire et reconnaissable pour une startup spécialisée dans l'éclairage connecté.",
          coverImage:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1600",
          tags: ["Logo", "Identité"],
          client: "Lumen",
          year: "2024",
          featured: true,
          order: 3,
        },
      ],
    });
  }

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
