import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/accueil", label: "Accueil", icon: "home" },
  { href: "/colocations/membres", label: "Membres", icon: "users" },
  { href: "/colocations/configuration", label: "Configuration", icon: "settings" },
  { href: "/outils/reservations", label: "Réservations", icon: "calendar" },
  { href: "/outils/depenses-partagees", label: "Dépenses", icon: "wallet" },
  { href: "/outils/planning-repas", label: "Planning repas", icon: "utensils" },
  { href: "/outils/liste-de-courses", label: "Liste de courses", icon: "shopping" },
  { href: "/outils/taches", label: "Tâches", icon: "checklist" },
  { href: "/outils/calendrier", label: "Calendrier", icon: "calendarCheck" },
  { href: "/outils/inventaire", label: "Inventaire", icon: "box" },
  { href: "/outils/annonces", label: "Annonces", icon: "megaphone" },
  { href: "/outils/votes", label: "Votes", icon: "megaphone" },
] as const;

type Props = {
  children: React.ReactNode;
  user: {
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
  activeHouseholdName?: string | null;
  hasMultipleHouseholds?: boolean;
};

export function AppShell({ children, activeHouseholdName, hasMultipleHouseholds, user }: Props) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar
        navItems={NAV_LINKS}
        activeHouseholdName={activeHouseholdName}
        hasMultipleHouseholds={hasMultipleHouseholds}
        user={user}
      />
      <div className="flex-1">
        <main className={cn("min-h-screen px-4 pb-24 pt-6 sm:px-8 lg:px-12")}>{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
