# ResourceHub

Plateforme premium qui centralise des ressources créatives **légales** — jeux, films, plugins, logiciels, templates, musique — créées en interne ou libres de droits.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui + Magic UI
- **Framer Motion** (animations premium)
- **Prisma** + **PostgreSQL** (Neon / Supabase / Railway)
- **NextAuth** (Credentials + Google + GitHub OAuth)
- **Stripe** (abonnements Premium / VIP)
- **Cloudinary** (uploads + URLs signées pour téléchargements)

## Fonctionnalités

### Côté visiteur

- Landing premium animée (Hero parallax, bento catégories, marquee, stats animées)
- Catalogue `/resources` filtrable (catégorie / niveau d'accès / recherche / tri)
- Page détail `/resources/[slug]` avec galerie, panneau download, favoris, signalements, avis
- `/pricing` — 3 plans (Gratuit / Premium 9,99€ / VIP 24,99€) + tableau comparatif
- `/account` — profil, plan, historique téléchargements, favoris, accès au Customer Portal Stripe
- `/auth/login` & `/auth/register` — email/password + Google + GitHub
- Téléchargements quotassés (5/mois FREE, illimités PREMIUM/VIP) avec URL Cloudinary signée 15 min
- Gating automatique par plan (`canAccess(userPlan, resourceAccess)`)

### Côté admin (`/admin`)

- Dashboard avec KPI (ressources, users, abonnements actifs, DL totaux, revenu estimé)
- **Ressources** — CRUD complet, statut DRAFT/PENDING/PUBLISHED/REJECTED, mise en avant
- **Utilisateurs** — liste + édition rôle (USER/CONTRIBUTOR/MODERATOR/ADMIN) + plan
- **Abonnements** — vue Stripe (actifs, annulés, paiements)
- **Signalements** — file d'attente DMCA avec actions résoudre / dépublier
- **Plans, Stats, FAQ, Messages, Services, Process, Paramètres** — gestion existante

## Démarrage local

```bash
npm install
cp .env.example .env       # remplis les variables
npm run db:push            # crée les tables
npm run db:seed            # admin + 8 ressources démo + plans
npm run dev
```

Visite :
- Site : http://localhost:3000
- Compte admin : email/password de `.env`
- Admin panel : `http://localhost:3000/<ADMIN_SECRET>` puis `/admin/login`

## Variables d'environnement

### Requises pour démarrer

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL — Neon/Supabase/Railway |
| `NEXTAUTH_URL` | http://localhost:3000 en dev |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_EMAIL` + `ADMIN_PASSWORD` | seed du compte admin |
| `ADMIN_SECRET` | URL secrète pour atteindre `/admin` |
| `CLOUDINARY_*` (4 variables) | uploads images |

### Facultatives (la plateforme tourne sans, mais les abonnements / OAuth seront désactivés)

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | endpoint webhook `/api/stripe/webhook` |
| `STRIPE_PRICE_PREMIUM` | ID du prix Premium (9,99€/mois) |
| `STRIPE_PRICE_VIP` | ID du prix VIP (24,99€/mois) |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | Console Google OAuth |
| `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` | GitHub Settings → OAuth apps |

## Configuration Stripe

1. Dashboard Stripe → **Products** → crée 2 prix récurrents (9,99€/mois "Premium", 24,99€/mois "VIP")
2. Récupère les IDs `price_...` → mets-les dans `STRIPE_PRICE_PREMIUM` et `STRIPE_PRICE_VIP`
3. **Developers → Webhooks** → ajoute endpoint `https://<ton-site>/api/stripe/webhook` avec les events :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copie le `Signing secret` → `STRIPE_WEBHOOK_SECRET`

Test local : `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Configuration OAuth

### Google
1. https://console.cloud.google.com → **APIs & Services → Credentials → OAuth client ID** (type Web)
2. Redirect URI : `http://localhost:3000/api/auth/callback/google` (+ prod)
3. Copie `Client ID` et `Secret` dans `.env`

### GitHub
1. https://github.com/settings/developers → **New OAuth App**
2. Authorization callback URL : `http://localhost:3000/api/auth/callback/github` (+ prod)
3. Copie `Client ID` et génère un `Secret`

## Architecture

```
src/
  app/
    (public)/
      page.tsx                # Landing
      resources/              # Catalogue + filtres + détail
      pricing/                # Plans + tableau comparatif
      account/                # Espace user (profil, DL, favoris)
      a-propos/, contact/, faq/
    auth/
      login/, register/       # NextAuth credentials + OAuth
    admin/
      login/                  # Login admin (cookie + JWT)
      (panel)/
        resources/            # CRUD ressources
        users/                # Gestion users + rôles + plans
        subscriptions/        # Vue Stripe
        reports/              # Modération DMCA
        ... (services, faq, etc.)
    api/
      auth/[...nextauth]/
      auth/register/          # Création compte
      stripe/
        checkout/             # POST plan -> URL Stripe Checkout
        portal/               # POST -> Customer Portal
        webhook/              # Stripe events -> Prisma sync
      resources/[slug]/
        favorite/             # POST toggle
        report/               # POST DMCA
        comments/             # GET/POST avis
        download/             # POST quota + log + URL signée
      admin/
        resources/[id]/       # PUT/PATCH/DELETE
        users/[id]/
        reports/[id]/
        upload/               # Cloudinary upload
  components/
    Hero, Navbar, Footer, ResourceCard
    ResourceActions          # Favoris + signalement + DL (client)
    ResourceComments         # Avis + notes (client)
    OAuthButtons             # Boutons Google + GitHub
    PricingCta               # Bouton Stripe checkout
    admin/                   # ResourceForm, ImageUpload
    magicui/                 # 10 composants Magic UI
    sections/                # Pricing / Process / Stats / FAQ
  lib/
    auth.ts, prisma.ts
    stripe.ts                # SDK + helpers planFromPriceId
    cloudinary.ts            # upload + signCloudinaryUrl
    utils.ts                 # categoryLabel, accessLabel, canAccess, etc.
  middleware.ts              # Double verrou /admin (cookie + JWT)
prisma/
  schema.prisma              # User, Resource, Favorite, Download, Comment,
                             # Report, Subscription, Payment, ...
  seed.ts                    # admin + 8 ressources + 3 plans + FAQ
```

## Sécurité

- `/admin/*` derrière double verrou (cookie httpOnly + JWT NextAuth)
- API admin vérifie `role === ADMIN || MODERATOR` côté serveur
- Téléchargements gatés par plan utilisateur (`canAccess`)
- URL Cloudinary signée 15 min pour les fichiers protégés
- Quota free 5 DL/mois enforced server-side
- Mots de passe bcrypt (10 rounds)
- DMCA signalement → file admin, dépublication 1-clic

## Roadmap

### Sprint 3 (à venir)

- **i18n FR/EN** via next-intl — refactor de tous les textes en clés
- **Recherche avancée** (Algolia ou Postgres FTS)
- **Notifications email** (Resend) — bienvenue, paiement, signalement résolu
- **Mode contributeur** — UI publique pour proposer une ressource
- **Page publique créateur** — `/c/[slug]`
- **Tests** — Playwright e2e + Vitest unit
- **Sitemap dynamique** + balises OG par ressource
- **Dark/light mode toggle** dans la navbar

## Déploiement Netlify

1. Push le repo sur GitHub
2. Netlify → Import → connect repo
3. Build : `npm run build` — Publish : `.next`
4. Environment variables : tout `.env` + `NEXTAUTH_URL` = ton URL Netlify
5. Premier déploiement :
   ```bash
   DATABASE_URL="<prod-url>" npm run db:push
   DATABASE_URL="<prod-url>" npm run db:seed
   ```
6. Configure le webhook Stripe sur l'URL prod
7. Configure les redirect URI OAuth sur l'URL prod
