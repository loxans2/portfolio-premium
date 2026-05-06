import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
    <>
      <Navbar siteName={s?.siteName ?? "Studio"} />
      <main className="min-h-screen">{children}</main>
      <Footer
        siteName={s?.siteName ?? "Studio"}
        email={s?.email ?? ""}
        instagram={s?.instagram}
        linkedin={s?.linkedin}
        github={s?.github}
      />
    </>
  );
}
