import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Flag,
  Settings,
  MessageSquare,
  HelpCircle,
  Workflow,
  Tags,
  BarChart3,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { AuthSessionProvider } from "@/components/admin/SessionProvider";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/resources", label: "Ressources", icon: Package },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/subscriptions", label: "Abonnements", icon: CreditCard },
  { href: "/admin/reports", label: "Signalements", icon: Flag },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/services", label: "Avantages", icon: Briefcase },
  { href: "/admin/process", label: "Process", icon: Workflow },
  { href: "/admin/pricing", label: "Plans", icon: Tags },
  { href: "/admin/stats", label: "Stats site", icon: BarChart3 },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <div className="min-h-screen bg-background">
        <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-border/60 bg-card/30 backdrop-blur p-6 hidden md:flex flex-col">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-display text-xl font-semibold mb-8"
          >
            <Sparkles size={18} className="text-gold" />
            ResourceHub
            <span className="block text-xs font-sans font-normal text-muted-foreground mt-1 w-full">
              Espace admin
            </span>
          </Link>
          <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin">
            {nav.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  <Icon size={16} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 pt-6 border-t border-border/60">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voir le site
            </Link>
            <SignOutButton />
          </div>
        </aside>

        <div className="md:pl-64">
          <main className="p-6 md:p-10">{children}</main>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
