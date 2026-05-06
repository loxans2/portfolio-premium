# Portfolio Premium

Portfolio premium pour mettre en avant tes sites web, chartes graphiques et logos. Toi seul peux modifier le contenu via l'espace admin (`/admin`).

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Framer Motion** (animations premium : reveal scroll, hero parallax, hover magnétique, transitions)
- **Prisma** + **Postgres** (Neon recommandé)
- **NextAuth** (auth credentials, un seul utilisateur admin)
- **Cloudinary** (upload des images)

## Démarrage local

### 1. Installer

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copie `.env.example` vers `.env` puis remplis :

```bash
DATABASE_URL="postgresql://..."         # Crée gratuitement sur https://neon.tech
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."                    # Génère avec: openssl rand -base64 32
ADMIN_EMAIL="echemereau@gmail.com"
ADMIN_PASSWORD="ton-mot-de-passe-fort"
CLOUDINARY_CLOUD_NAME="..."              # https://cloudinary.com (gratuit)
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
```

### 3. Initialiser la base de données

```bash
npm run db:push     # crée les tables
npm run db:seed     # crée ton utilisateur admin + données démo
```

### 4. Lancer le dev

```bash
npm run dev
```

- Site public : http://localhost:3000
- Admin : http://localhost:3000/admin (utilise tes identifiants `.env`)

## Déploiement sur Netlify

### 1. Préparer la base de données (Neon, gratuit)

1. Crée un compte sur [neon.tech](https://neon.tech)
2. Crée un projet → copie la `DATABASE_URL` (avec `?sslmode=require`)

### 2. Préparer Cloudinary (gratuit, 25 GB)

1. Crée un compte sur [cloudinary.com](https://cloudinary.com)
2. Dashboard → récupère `Cloud Name`, `API Key`, `API Secret`

### 3. Pousser sur GitHub

```bash
git init
git add -A
git commit -m "init: portfolio premium"
git remote add origin https://github.com/<ton-user>/<repo>.git
git push -u origin main
```

### 4. Déployer sur Netlify

1. Va sur [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. Connecte ton repo GitHub
3. Build command : `npm run build` — Publish directory : `.next`
4. **Site settings → Environment variables** : ajoute toutes les variables du `.env` :
   - `DATABASE_URL`
   - `NEXTAUTH_URL` → `https://<ton-site>.netlify.app`
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
5. Première fois : ouvre le shell Netlify ou exécute en local pointé vers la prod :
   ```bash
   DATABASE_URL="<prod-url>" npm run db:push
   ADMIN_EMAIL=... ADMIN_PASSWORD=... DATABASE_URL="<prod-url>" npm run db:seed
   ```
6. Deploy 🚀

## Structure

```
src/
  app/
    (public)/             # Site vitrine — accessible à tous
      page.tsx            # Accueil
      projets/            # Liste + détail
      services/
      a-propos/
      contact/
    admin/
      login/              # Connexion (publique)
      (panel)/            # Espace admin — protégé par middleware
        page.tsx          # Dashboard
        projets/          # CRUD projets
        services/         # CRUD services
        temoignages/
        settings/         # Réglages globaux
        messages/         # Messages reçus
    api/
      auth/[...nextauth]/ # NextAuth
      admin/upload/       # Upload images (auth requis)
  components/             # Composants UI partagés
  lib/                    # prisma, auth, cloudinary, utils
  middleware.ts           # Protège /admin/* et /api/admin/*
prisma/
  schema.prisma
  seed.ts
```

## Comment ajouter du contenu

1. Connecte-toi à `/admin` avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`
2. **Projets** → Nouveau projet : titre, catégorie (site web / identité / logo / graphisme), images, description, etc.
3. **Services** : édite/ajoute les services proposés (icônes Lucide)
4. **Témoignages** : avis clients
5. **Paramètres** : nom du studio, hero, à propos, contact, réseaux sociaux
6. **Messages** : tu reçois ici les demandes via le formulaire de contact

Toute modification est visible immédiatement sur le site (revalidation à la sauvegarde).

## Sécurité

- Les routes `/admin/*` (sauf `/admin/login`) et `/api/admin/*` sont protégées par middleware NextAuth
- Le mot de passe admin est haché (bcrypt) et stocké en base
- Personne d'autre ne peut modifier le contenu — seul toi avec tes identifiants

## Animations Framer Motion

- Hero : parallax + reveal mot par mot + orbes animés
- Scroll : reveal en cascade avec `useInView`
- Cartes projets : zoom hover + flèche pivotante
- Boutons : effet magnétique (suivent le curseur)
- Navbar : sticky avec blur progressif + pill animé
- Marquee infini sur la home

## Personnalisation

- Couleur d'accent (or) : modifiable dans `src/app/globals.css` (variable `--gold`)
- Polices : `Fraunces` (titres) + `Inter` (corps), changeables dans `src/app/layout.tsx`
- Theme : light + dark (via `next-themes`)
