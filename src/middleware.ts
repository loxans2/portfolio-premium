import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * SÉCURITÉ — double verrou :
 *  1. URL secrète  → plante un cookie httpOnly signé
 *  2. NextAuth JWT → vérifie la session admin
 *
 * Pour accéder au panel :
 *   1. Visite https://ton-site.com/<ADMIN_SECRET>
 *   2. Tu es redirigé vers /admin/login avec le cookie planté
 *   3. Connecte-toi avec ton email + mot de passe
 *
 * Toute requête sur /admin/* SANS le cookie → répond 404 (introuvable)
 * Même si quelqu'un devine /admin, il ne verra rien.
 */

const SECRET_PATH = process.env.ADMIN_SECRET ?? "";
const GATE_COOKIE = "sg_access"; // nom neutre pour ne pas attirer l'attention

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ────────────────────────────────────────────────
  // ① URL secrète → plante le cookie et redirige
  // ────────────────────────────────────────────────
  if (SECRET_PATH && path === `/${SECRET_PATH}`) {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.set(GATE_COOKIE, SECRET_PATH, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
    });
    return res;
  }

  // ────────────────────────────────────────────────
  // ② Routes admin → double vérification
  // ────────────────────────────────────────────────
  const isAdmin =
    path.startsWith("/admin") || path.startsWith("/api/admin");

  if (isAdmin) {
    // Verrou 1 : cookie secret (obscurité)
    if (SECRET_PATH) {
      const gate = req.cookies.get(GATE_COOKIE);
      if (!gate || gate.value !== SECRET_PATH) {
        // Répond 404 — ne révèle même pas que la route existe
        return new NextResponse(null, { status: 404 });
      }
    }

    // Page de login → accessible avec le cookie (pas besoin de session)
    if (path === "/admin/login") return NextResponse.next();

    // Routes /api/admin/* → gèrent leur propre 401 JSON en interne
    if (path.startsWith("/api/admin")) return NextResponse.next();

    // Verrou 2 : session NextAuth
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher large pour attraper l'URL secrète (segment unique quelconque)
  // On exclut les assets statiques pour ne pas ralentir
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.ico).*)",
  ],
};
