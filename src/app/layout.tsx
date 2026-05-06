import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

async function getSettings() {
  try {
    return await prisma.settings.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s?.siteName ?? "Studio";
  const tagline = s?.tagline ?? "Sites premium, identités sur mesure.";
  return {
    title: { default: `${name} — ${tagline}`, template: `%s | ${name}` },
    description: tagline,
    icons: { icon: "/favicon.svg" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
