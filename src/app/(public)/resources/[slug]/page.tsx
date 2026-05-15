import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Star,
  Calendar,
  HardDrive,
  ShieldCheck,
  Lock,
  Crown,
  Sparkles,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  accessLabel,
  categoryLabel,
  cn,
  formatNumber,
} from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceActions } from "@/components/ResourceActions";
import { ResourceComments } from "@/components/ResourceComments";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const r = await prisma.resource
    .findUnique({ where: { slug: params.slug } })
    .catch(() => null);
  if (!r) return { title: "Ressource introuvable" };
  return {
    title: `${r.title} — ResourceHub`,
    description: r.excerpt,
    openGraph: { images: [r.coverImage] },
  };
}

export default async function ResourcePage({
  params,
}: {
  params: { slug: string };
}) {
  const r = await prisma.resource
    .findUnique({ where: { slug: params.slug } })
    .catch(() => null);

  if (!r || r.status !== "PUBLISHED") notFound();

  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const isAuthed = Boolean(user?.id);

  const initialFavorited = isAuthed
    ? Boolean(
        await prisma.favorite
          .findUnique({
            where: {
              userId_resourceId: { userId: user.id, resourceId: r.id },
            },
            select: { id: true },
          })
          .catch(() => null),
      )
    : false;

  const related = await prisma.resource
    .findMany({
      where: {
        status: "PUBLISHED",
        category: r.category,
        NOT: { id: r.id },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    })
    .catch(() => []);

  const AccessIcon =
    r.access === "VIP" ? Crown : r.access === "PREMIUM" ? Lock : Download;

  return (
    <div className="pt-32 pb-24 md:pt-36">
      <div className="container">
        <Reveal>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Retour au catalogue
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.5fr,1fr]">
          {/* LEFT — cover + description */}
          <div className="space-y-8">
            <Reveal>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/60 bg-card">
                <Image
                  src={r.coverImage}
                  alt={r.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium text-white border border-white/20">
                    {categoryLabel(r.category)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border",
                      r.access === "VIP"
                        ? "bg-gold/90 text-black border-gold"
                        : r.access === "PREMIUM"
                          ? "bg-foreground/90 text-background border-foreground/50"
                          : "bg-emerald-500/90 text-white border-emerald-400/50",
                    )}
                  >
                    <AccessIcon size={11} />
                    {accessLabel(r.access)}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
                {r.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed text-balance">
                {r.excerpt}
              </p>
            </Reveal>

            {r.tags.length > 0 && (
              <Reveal delay={0.15}>
                <div className="flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              <div className="prose prose-invert max-w-none">
                <h2 className="font-display text-2xl font-medium mb-4">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {r.description}
                </p>
              </div>
            </Reveal>

            {r.images.length > 0 && (
              <Reveal delay={0.25}>
                <h2 className="font-display text-2xl font-medium mb-4">
                  Aperçus
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {r.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60"
                    >
                      <Image
                        src={img}
                        alt={`${r.title} — aperçu ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* RIGHT — sticky download panel */}
          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-card p-6">
                {r.access !== "FREE" && <BorderBeam size={200} duration={10} />}

                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                  <AccessIcon size={12} />
                  Accès {accessLabel(r.access)}
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <Row icon={Calendar} label="Publié le">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Row>
                  {r.version && (
                    <Row icon={Sparkles} label="Version">
                      {r.version}
                    </Row>
                  )}
                  {r.fileSize && (
                    <Row icon={HardDrive} label="Taille">
                      {r.fileSize}
                    </Row>
                  )}
                  {r.license && (
                    <Row icon={ShieldCheck} label="Licence">
                      {r.license}
                    </Row>
                  )}
                  <Row icon={Download} label="Téléchargements">
                    {formatNumber(r.downloads)}
                  </Row>
                  {r.ratingCount > 0 && (
                    <Row icon={Star} label="Note">
                      {r.ratingAvg.toFixed(1)} / 5 ({r.ratingCount} avis)
                    </Row>
                  )}
                </div>

                <div className="mt-6">
                  <ResourceActions
                    slug={r.slug}
                    access={r.access as any}
                    fileUrl={r.fileUrl}
                    initialFavorited={initialFavorited}
                    userPlan={user?.plan}
                    isAuthed={isAuthed}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Comments */}
        <ResourceComments slug={r.slug} isAuthed={isAuthed} />

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl mb-8">
                Dans la même catégorie
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((r2) => (
                <ResourceCard
                  key={r2.id}
                  slug={r2.slug}
                  title={r2.title}
                  excerpt={r2.excerpt}
                  category={r2.category}
                  access={r2.access}
                  coverImage={r2.coverImage}
                  tags={r2.tags}
                  featured={r2.featured}
                  downloads={r2.downloads}
                  ratingAvg={r2.ratingAvg}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon size={13} />
        {label}
      </span>
      <span className="text-foreground/90 text-right">{children}</span>
    </div>
  );
}
