"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Users, Wrench } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bottomNav = [
  { href: "/accueil", label: "Accueil", icon: Home },
  { href: "/colocations/membres", label: "Membres", icon: Users },
  { href: "/compte/profil", label: "Compte", icon: Settings },
];

const toolLinks = [
  { href: "/outils/reservations", label: "Réservations" },
  { href: "/outils/depenses-partagees", label: "Dépenses partagées" },
  { href: "/outils/planning-repas", label: "Planning repas" },
  { href: "/outils/liste-de-courses", label: "Liste de courses" },
  { href: "/outils/taches", label: "Tâches" },
  { href: "/outils/calendrier", label: "Calendrier maison" },
  { href: "/outils/inventaire", label: "Inventaire" },
  { href: "/outils/annonces", label: "Annonces" },
  { href: "/outils/votes", label: "Votes" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 px-4 py-2 shadow-2xl lg:hidden">
      <div className="flex items-center justify-around text-sm">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex flex-col items-center gap-1", isActive ? "text-emerald-600" : "text-muted-foreground")}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="h-12 w-12 -translate-y-8 rounded-full shadow-lg">
              <Wrench className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Outils NotreColoc</SheetTitle>
            </SheetHeader>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {toolLinks.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-xl border border-border/70 p-3 text-left font-medium transition hover:border-emerald-300"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
