import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthSessionProvider } from "@/components/admin/SessionProvider";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  try {
    return await prisma.settings.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();
  return (
    <AuthSessionProvider>
      <Navbar siteName={s?.siteName ?? "ResourceHub"} />
      <main className="min-h-screen">{children}</main>
      <Footer
        siteName={s?.siteName ?? "ResourceHub"}
        email={s?.email ?? ""}
        instagram={s?.instagram}
        linkedin={s?.linkedin}
        github={s?.github}
      />
    </AuthSessionProvider>
  );
}
