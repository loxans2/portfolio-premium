import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mot de passe", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });
      if (!user || !user.password) return null;
      const valid = await bcrypt.compare(credentials.password, user.password);
      if (!valid) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
      } as any;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth : crée/met à jour le user dans la DB
      if (account && account.provider !== "credentials" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? (profile as any)?.name ?? null,
              avatar: user.image ?? null,
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          });
        } else if (!existing.provider) {
          // user existant avec credentials qui se connecte via OAuth → lier
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              provider: account.provider,
              providerId: account.providerAccountId,
              avatar: existing.avatar ?? user.image ?? null,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // Au login, user est défini
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.plan = (user as any).plan;
      }
      // Pour OAuth, user.id n'est pas l'id DB → refetch
      if (token.email && (!token.role || !token.plan)) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true, role: true, plan: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = (token as any).role;
        (session.user as any).plan = (token as any).plan;
      }
      return session;
    },
  },
};

export function isAdminRole(role?: string | null) {
  return role === "ADMIN" || role === "MODERATOR";
}
