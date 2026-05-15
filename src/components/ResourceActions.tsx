"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Flag, Download, Crown, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accessLabel, canAccess, cn } from "@/lib/utils";

interface Props {
  slug: string;
  access: "FREE" | "PREMIUM" | "VIP";
  fileUrl: string | null;
  initialFavorited: boolean;
  userPlan?: string;
  isAuthed: boolean;
}

export function ResourceActions({
  slug,
  access,
  fileUrl,
  initialFavorited,
  userPlan,
  isAuthed,
}: Props) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [favBusy, setFavBusy] = useState(false);
  const [dlBusy, setDlBusy] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const hasAccess = canAccess(userPlan, access);

  async function toggleFav() {
    if (!isAuthed) {
      router.push(`/auth/login?callbackUrl=/resources/${slug}`);
      return;
    }
    setFavBusy(true);
    const res = await fetch(`/api/resources/${slug}/favorite`, {
      method: "POST",
    });
    setFavBusy(false);
    if (!res.ok) {
      toast.error("Action impossible");
      return;
    }
    const data = await res.json();
    setFavorited(data.favorited);
    toast.success(data.favorited ? "Ajouté aux favoris" : "Retiré des favoris");
  }

  async function handleDownload() {
    if (!isAuthed) {
      router.push(`/auth/login?callbackUrl=/resources/${slug}`);
      return;
    }
    setDlBusy(true);
    const res = await fetch(`/api/resources/${slug}/download`, {
      method: "POST",
    });
    setDlBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Téléchargement impossible");
      return;
    }
    toast.success("Téléchargement lancé");
    window.open(data.url, "_blank");
    router.refresh();
  }

  return (
    <>
      <div className="space-y-2">
        {!isAuthed ? (
          <>
            <Button asChild variant="gold" className="w-full">
              <Link href={`/auth/login?callbackUrl=/resources/${slug}`}>
                Se connecter pour télécharger
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Compte gratuit en 30 secondes.
            </p>
          </>
        ) : hasAccess && fileUrl ? (
          <Button
            variant="gold"
            className="w-full"
            onClick={handleDownload}
            disabled={dlBusy}
          >
            <Download size={16} />
            {dlBusy ? "Préparation..." : "Télécharger"}
          </Button>
        ) : !hasAccess ? (
          <>
            <Button asChild variant="gold" className="w-full">
              <Link href="/pricing">
                <Crown size={16} />
                Passer {accessLabel(access)}
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Ressource réservée aux abonnés {accessLabel(access)}.
            </p>
          </>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Fichier non disponible
          </Button>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFav}
            disabled={favBusy}
            className={cn(favorited && "border-gold/40 text-gold")}
          >
            <Heart size={14} className={cn(favorited && "fill-gold")} />
            {favorited ? "Favori" : "Favori"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isAuthed) {
                router.push(`/auth/login?callbackUrl=/resources/${slug}`);
                return;
              }
              setReportOpen(true);
            }}
          >
            <Flag size={14} />
            Signaler
          </Button>
        </div>
      </div>

      {reportOpen && (
        <ReportModal
          slug={slug}
          onClose={() => setReportOpen(false)}
        />
      )}
    </>
  );
}

function ReportModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/resources/${slug}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason: fd.get("reason") as string,
        details: (fd.get("details") as string) || undefined,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Signalement échoué");
      return;
    }
    toast.success("Signalement envoyé. Merci.");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-medium">
            Signaler cette ressource
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent cursor-pointer"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Notre équipe examine chaque signalement sous 24h.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motif</Label>
            <select
              id="reason"
              name="reason"
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Choisir un motif…</option>
              <option value="Contenu illégal / piratage">
                Contenu illégal / piratage
              </option>
              <option value="Violation de droits d'auteur (DMCA)">
                Violation de droits d'auteur (DMCA)
              </option>
              <option value="Contenu inapproprié">Contenu inapproprié</option>
              <option value="Spam / arnaque">Spam / arnaque</option>
              <option value="Fichier corrompu / malware">
                Fichier corrompu / malware
              </option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Détails (facultatif)</Label>
            <Textarea
              id="details"
              name="details"
              rows={4}
              placeholder="Expliquez le problème…"
              maxLength={2000}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit" variant="gold" disabled={busy}>
              {busy ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
