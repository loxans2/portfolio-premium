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

  const stats = [
    { id: "stat-1", label: "Projets livrés", value: 42, suffix: "+", order: 1 },
    { id: "stat-2", label: "Années d'expérience", value: 8, suffix: "", order: 2 },
    { id: "stat-3", label: "Clients satisfaits", value: 98, suffix: "%", order: 3 },
    { id: "stat-4", label: "Cafés bus", value: 1240, suffix: "", order: 4 },
  ];
  for (const s of stats) {
    await prisma.stat.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  const steps = [
    {
      id: "step-1",
      title: "Discovery",
      description:
        "On échange autour de votre vision, vos objectifs, votre cible. Je formalise un brief précis.",
      icon: "MessageCircle",
      duration: "1 semaine",
      order: 1,
    },
    {
      id: "step-2",
      title: "Direction artistique",
      description:
        "Recherche de moodboards, exploration typographique et chromatique. Validation d'une direction.",
      icon: "Palette",
      duration: "1-2 semaines",
      order: 2,
    },
    {
      id: "step-3",
      title: "Design & développement",
      description:
        "Je conçois et code l'identité ou le site, en allers-retours réguliers avec vous.",
      icon: "Wand2",
      duration: "2-4 semaines",
      order: 3,
    },
    {
      id: "step-4",
      title: "Livraison & suivi",
      description:
        "Mise en ligne, formation, livrables sources. Support post-projet inclus.",
      icon: "Rocket",
      duration: "1 semaine",
      order: 4,
    },
  ];
  for (const s of steps) {
    await prisma.processStep.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  const plans = [
    {
      id: "plan-1",
      name: "Logo",
      price: "À partir de 690 €",
      priceSuffix: "",
      description: "Un symbole unique, modulaire, pensé pour durer.",
      features: [
        "3 propositions créatives",
        "2 allers-retours",
        "Logo principal + variantes",
        "Fichiers vectoriels (SVG, PDF, PNG)",
        "Charte d'utilisation simple",
      ],
      cta: "Commander",
      ctaUrl: "/contact",
      highlighted: false,
      order: 1,
    },
    {
      id: "plan-2",
      name: "Identité complète",
      price: "À partir de 2 200 €",
      priceSuffix: "",
      description: "Logo + charte graphique complète + déclinaisons.",
      features: [
        "Tout le forfait Logo",
        "Charte graphique 20 pages",
        "Palette + typographies",
        "Templates réseaux sociaux",
        "Cartes de visite + papeterie",
        "Suivi 30 jours après livraison",
      ],
      cta: "Démarrer",
      ctaUrl: "/contact",
      highlighted: true,
      order: 2,
    },
    {
      id: "plan-3",
      name: "Site + Branding",
      price: "Sur devis",
      priceSuffix: "",
      description: "Le combo : identité complète + site sur mesure.",
      features: [
        "Tout le forfait Identité",
        "Site web Next.js sur mesure",
        "Animations Framer Motion",
        "CMS pour gérer le contenu",
        "Déploiement + nom de domaine",
        "3 mois de support inclus",
      ],
      cta: "Demander un devis",
      ctaUrl: "/contact",
      highlighted: false,
      order: 3,
    },
  ];
  for (const p of plans) {
    await prisma.pricingPlan.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  const faqs = [
    {
      id: "faq-1",
      question: "Combien de temps prend un projet ?",
      answer:
        "Comptez 2 à 4 semaines pour un logo, 4 à 6 semaines pour une identité complète, et 6 à 10 semaines pour un site web sur mesure. Les délais exacts dépendent du périmètre et de la disponibilité des contenus.",
      order: 1,
    },
    {
      id: "faq-2",
      question: "Comment se passe un projet avec vous ?",
      answer:
        "Je travaille en quatre étapes : discovery (brief approfondi), direction artistique (moodboards, exploration), design / développement (en allers-retours réguliers), et livraison (mise en ligne, formation, fichiers sources).",
      order: 2,
    },
    {
      id: "faq-3",
      question: "À qui appartient le travail livré ?",
      answer:
        "À vous, intégralement. Une fois le solde réglé, vous recevez tous les fichiers sources et la cession des droits patrimoniaux pour une utilisation illimitée.",
      order: 3,
    },
    {
      id: "faq-4",
      question: "Est-ce que vous proposez de la maintenance ?",
      answer:
        "Oui, après la livraison je propose un forfait de maintenance mensuel (sécurité, mises à jour, petites évolutions). Les 3 premiers mois de support sont inclus dans le pack Site + Branding.",
      order: 4,
    },
    {
      id: "faq-5",
      question: "Acceptez-vous les paiements échelonnés ?",
      answer:
        "Oui : 30% à la signature, 30% à la validation des maquettes, 40% à la livraison. Pour les gros projets, on peut découper différemment.",
      order: 5,
    },
    {
      id: "faq-6",
      question: "Travaillez-vous à distance ?",
      answer:
        "Oui, 100% à distance avec des points en visio réguliers. Je suis basé en France et travaille avec des clients dans toute l'Europe et au Canada.",
      order: 6,
    },
  ];
  for (const f of faqs) {
    await prisma.faq.upsert({
      where: { id: f.id },
      update: f,
      create: f,
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
