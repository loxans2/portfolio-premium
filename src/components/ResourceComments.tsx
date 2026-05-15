"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  body: string;
  rating: number;
  createdAt: string;
  user: { name: string | null; email: string; avatar: string | null };
}

interface Props {
  slug: string;
  isAuthed: boolean;
}

export function ResourceComments({ slug, isAuthed }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/resources/${slug}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length < 2) {
      toast.error("Avis trop court");
      return;
    }
    setPosting(true);
    const res = await fetch(`/api/resources/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, rating }),
    });
    setPosting(false);
    if (!res.ok) {
      toast.error("Publication impossible");
      return;
    }
    const created = await res.json();
    setComments((c) => [created, ...c]);
    setBody("");
    setRating(5);
    toast.success("Avis publié");
  }

  return (
    <section className="mt-24">
      <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl mb-8">
        Avis ({comments.length})
      </h2>

      {isAuthed ? (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-border/60 bg-card p-6 mb-8 space-y-4"
        >
          <div>
            <p className="text-sm font-medium mb-2">Votre note</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                  aria-label={`${n} étoiles`}
                >
                  <Star
                    size={22}
                    className={cn(
                      "transition-colors",
                      n <= rating
                        ? "fill-gold text-gold"
                        : "text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Partagez votre avis sur cette ressource…"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="gold" disabled={posting}>
              {posting ? "Publication..." : "Publier mon avis"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/60 p-6 mb-8 text-center">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/auth/login?callbackUrl=/resources/${slug}`}
              className="text-gold hover:underline"
            >
              Connectez-vous
            </Link>{" "}
            pour laisser un avis.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          Aucun avis pour le moment. Soyez le premier !
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-border/60 bg-card p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">
                    {c.user.name ?? c.user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {c.rating > 0 && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < c.rating
                            ? "fill-gold text-gold"
                            : "text-muted-foreground/30"
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
