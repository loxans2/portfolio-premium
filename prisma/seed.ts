import { PrismaClient, ResourceCategory, ResourceAccess } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: "ADMIN", plan: "VIP" },
    create: {
      email,
      password: hash,
      name: "Admin",
      role: "ADMIN",
      plan: "VIP",
    },
  });

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "ResourceHub",
      tagline: "Toutes vos ressources premium, au même endroit.",
      bio:
        "ResourceHub centralise des ressources créatives — jeux, films, plugins, logiciels, templates — créés par notre équipe ou libres de droits, accessibles aux membres.",
      email,
      heroTitle: "Toutes vos ressources premium, au même endroit.",
      heroSubtitle:
        "Jeux, films, plugins, logiciels, templates. Créés par nous, libres de droits, accessibles aux abonnés.",
      aboutTitle: "À propos",
      aboutBody:
        "ResourceHub est une plateforme communautaire qui rassemble du contenu créatif de qualité. Chaque ressource est validée par notre équipe pour garantir originalité et conformité légale.",
    },
  });

  const services = [
    {
      id: "svc-1",
      title: "Téléchargements illimités",
      description:
        "Accédez à toutes les ressources sans restriction de quota avec un abonnement Premium ou VIP.",
      icon: "Download",
      order: 1,
    },
    {
      id: "svc-2",
      title: "Aucune publicité",
      description:
        "Profitez d'une expérience 100% sans pub dès l'abonnement Premium.",
      icon: "ShieldCheck",
      order: 2,
    },
    {
      id: "svc-3",
      title: "Accès anticipé",
      description:
        "Les VIP reçoivent les nouvelles ressources 7 jours avant tout le monde.",
      icon: "Sparkles",
      order: 3,
    },
    {
      id: "svc-4",
      title: "Communauté & support",
      description:
        "Discord privé, support prioritaire et possibilité de proposer vos propres ressources.",
      icon: "Users",
      order: 4,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  const resources = [
    {
      slug: "lumen-ui-kit",
      title: "Lumen UI Kit",
      category: ResourceCategory.TEMPLATES,
      excerpt: "Design system complet React + Tailwind, 120 composants.",
      description:
        "Un design system premium prêt à l'emploi : 120 composants React + Tailwind, dark mode, thème personnalisable, exemples Figma inclus. Libre de droits pour usage commercial.",
      coverImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600",
      tags: ["React", "Tailwind", "UI Kit", "Design System"],
      access: ResourceAccess.PREMIUM,
      version: "2.4.0",
      license: "MIT",
      featured: true,
      order: 1,
    },
    {
      slug: "aurora-lut-pack",
      title: "Aurora LUT Pack",
      category: ResourceCategory.PLUGINS,
      excerpt: "32 LUTs cinématographiques pour DaVinci, Premiere & FCPX.",
      description:
        "Un pack de 32 LUTs originales inspirées de la cinématographie nordique. Compatible DaVinci Resolve, Premiere Pro, Final Cut Pro X. Format .cube + presets dédiés.",
      coverImage:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600",
      tags: ["LUT", "Color Grading", "Video", "Free"],
      access: ResourceAccess.FREE,
      featured: true,
      order: 2,
    },
    {
      slug: "noir-typeface",
      title: "Noir — Display Typeface",
      category: ResourceCategory.TEMPLATES,
      excerpt: "Typographie display moderne, 6 graisses, 350+ glyphes.",
      description:
        "Une typographie display contemporaine pensée pour les titres et l'identité de marque. 6 graisses, italiques, 350+ glyphes, ligatures, support multi-langues.",
      coverImage:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600",
      tags: ["Typography", "Font", "Display"],
      access: ResourceAccess.VIP,
      license: "Création originale ResourceHub",
      featured: true,
      order: 3,
    },
    {
      slug: "synthwave-music-pack",
      title: "Synthwave Music Pack Vol. 1",
      category: ResourceCategory.MUSIC,
      excerpt: "12 pistes synthwave originales, libres de droits.",
      description:
        "12 pistes synthwave instrumentales créées en studio. Idéales pour vidéo, jeux indépendants, podcasts. Fichiers WAV + MP3 320kbps. Licence créative commerciale.",
      coverImage:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600",
      tags: ["Music", "Synthwave", "Audio", "Royalty-Free"],
      access: ResourceAccess.PREMIUM,
      featured: true,
      order: 4,
    },
    {
      slug: "indie-platformer-template",
      title: "Indie Platformer — Godot Template",
      category: ResourceCategory.GAMES,
      excerpt: "Template complet Godot 4 pour platformer 2D.",
      description:
        "Un template prêt à l'emploi sous Godot 4 : physique 2D, contrôleur joueur, ennemis, collectibles, système de checkpoints, menu principal. Code MIT, assets CC0.",
      coverImage:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600",
      tags: ["Godot", "Game Dev", "2D", "Template"],
      access: ResourceAccess.FREE,
      featured: false,
      order: 5,
    },
    {
      slug: "minimal-ebook-templates",
      title: "Pack Templates Ebook InDesign",
      category: ResourceCategory.EBOOKS,
      excerpt: "10 mises en page InDesign pour ebooks et lead magnets.",
      description:
        "10 templates InDesign + Affinity Publisher pour créer des ebooks, livres blancs ou lead magnets en quelques minutes. Polices incluses, grille modulable.",
      coverImage:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600",
      tags: ["InDesign", "Ebook", "Template", "Layout"],
      access: ResourceAccess.PREMIUM,
      featured: false,
      order: 6,
    },
    {
      slug: "documentaire-nord",
      title: "Court-métrage : Nord",
      category: ResourceCategory.MOVIES,
      excerpt: "Court-métrage documentaire 4K, créé par notre studio.",
      description:
        "Court-métrage documentaire de 18 minutes tourné en Islande, format 4K HDR. Production originale ResourceHub Studio. Disponible en téléchargement pour les abonnés VIP.",
      coverImage:
        "https://images.unsplash.com/photo-1531594896955-305a09b6b8e8?w=1600",
      tags: ["Documentaire", "4K", "Original"],
      access: ResourceAccess.VIP,
      featured: false,
      order: 7,
    },
    {
      slug: "open-toolbox-cli",
      title: "OpenToolbox CLI",
      category: ResourceCategory.SOFTWARE,
      excerpt: "Boîte à outils CLI multi-plateforme (Win/Mac/Linux).",
      description:
        "CLI open-source qui regroupe 40 utilitaires devs (conversion, hashing, snippets, etc.). Binaires signés pour Windows, macOS, Linux. Licence Apache 2.0.",
      coverImage:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600",
      tags: ["CLI", "Open Source", "Dev Tools"],
      access: ResourceAccess.FREE,
      featured: false,
      order: 8,
    },
  ];

  for (const r of resources) {
    await prisma.resource.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
  }

  const stats = [
    { id: "stat-1", label: "Ressources disponibles", value: 1240, suffix: "+", order: 1 },
    { id: "stat-2", label: "Téléchargements", value: 85, suffix: "k", order: 2 },
    { id: "stat-3", label: "Créateurs", value: 320, suffix: "+", order: 3 },
    { id: "stat-4", label: "Catégories", value: 9, suffix: "", order: 4 },
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
      title: "Inscrivez-vous",
      description: "Créez votre compte gratuit en 30 secondes. Aucune carte requise.",
      icon: "UserPlus",
      duration: "30 sec",
      order: 1,
    },
    {
      id: "step-2",
      title: "Explorez le catalogue",
      description:
        "Parcourez 9 catégories : jeux, films, plugins, logiciels, templates, musique, etc.",
      icon: "Search",
      duration: "Illimité",
      order: 2,
    },
    {
      id: "step-3",
      title: "Téléchargez en un clic",
      description:
        "Téléchargements rapides et sécurisés. Premium et VIP sans aucune publicité.",
      icon: "Download",
      duration: "Instantané",
      order: 3,
    },
    {
      id: "step-4",
      title: "Profitez des mises à jour",
      description:
        "Nouveaux contenus chaque semaine. Accès anticipé pour les abonnés VIP.",
      icon: "Sparkles",
      duration: "Hebdo",
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
      id: "plan-free",
      name: "Gratuit",
      price: "0 €",
      priceSuffix: "/mois",
      description: "Pour découvrir la plateforme.",
      features: [
        "Accès aux ressources gratuites",
        "5 téléchargements / mois",
        "Avec publicités",
        "Support communautaire",
      ],
      cta: "Créer un compte",
      ctaUrl: "/auth/register",
      highlighted: false,
      order: 1,
    },
    {
      id: "plan-premium",
      name: "Premium",
      price: "9,99 €",
      priceSuffix: "/mois",
      description: "Pour les créatifs réguliers.",
      features: [
        "Toutes les ressources Premium",
        "Téléchargements illimités",
        "Zéro publicité",
        "Support prioritaire",
        "Historique des téléchargements",
      ],
      cta: "S'abonner Premium",
      ctaUrl: "/auth/register?plan=PREMIUM",
      highlighted: true,
      order: 2,
    },
    {
      id: "plan-vip",
      name: "VIP",
      price: "24,99 €",
      priceSuffix: "/mois",
      description: "Pour les pros et les studios.",
      features: [
        "Tout Premium inclus",
        "Ressources VIP exclusives",
        "Accès anticipé (7 jours)",
        "Discord privé",
        "Licences commerciales étendues",
        "Téléchargement en lot",
      ],
      cta: "Devenir VIP",
      ctaUrl: "/auth/register?plan=VIP",
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
      question: "Qu'est-ce que ResourceHub ?",
      answer:
        "Une plateforme qui centralise des ressources créatives — jeux, films, plugins, logiciels, templates — soit créées par notre équipe, soit libres de droits, soit proposées par des contributeurs après validation.",
      order: 1,
    },
    {
      id: "faq-2",
      question: "Toutes les ressources sont-elles légales ?",
      answer:
        "Oui. Chaque ressource est soit produite en interne, soit publiée sous licence libre (MIT, CC0, CC-BY, Apache, etc.), soit fournie par un créateur ayant signé une cession de droits. Tout contenu signalé est retiré sous 24h.",
      order: 2,
    },
    {
      id: "faq-3",
      question: "Quelle est la différence entre Premium et VIP ?",
      answer:
        "Premium retire les publicités et débloque les téléchargements illimités sur les ressources standards. VIP ajoute les ressources exclusives, l'accès anticipé de 7 jours, le Discord privé et des licences commerciales étendues.",
      order: 3,
    },
    {
      id: "faq-4",
      question: "Puis-je annuler mon abonnement ?",
      answer:
        "Oui, à tout moment depuis votre espace compte. Vous conservez l'accès jusqu'à la fin de la période en cours, sans frais d'annulation.",
      order: 4,
    },
    {
      id: "faq-5",
      question: "Puis-je proposer mes propres ressources ?",
      answer:
        "Oui ! Les abonnés Premium et VIP peuvent demander le rôle Contributeur pour publier leurs créations (validation par modérateur). Possibilité de revenus partagés selon le plan choisi.",
      order: 5,
    },
    {
      id: "faq-6",
      question: "Quels modes de paiement acceptez-vous ?",
      answer:
        "Carte bancaire (Visa, Mastercard, Amex), Apple Pay, Google Pay, PayPal, virement SEPA. Tous les paiements sont traités via Stripe avec chiffrement de bout en bout.",
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

  console.log("Seed ResourceHub terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
