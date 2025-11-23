"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarClock,
  CalendarCheck,
  Wallet,
  Users,
  Settings,
  Utensils,
  ShoppingBag,
  ClipboardList,
  Box,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/navigation/user-menu";
import { Badge } from "@/components/ui/badge";
import { HouseholdSwitcher } from "@/components/navigation/household-switcher";

const ICONS = {
  home: Home,
  calendar: CalendarClock,
  calendarCheck: CalendarCheck,
  wallet: Wallet,
  users: Users,
  settings: Settings,
  utensils: Utensils,
  shopping: ShoppingBag,
  checklist: ClipboardList,
  box: Box,
  megaphone: Megaphone,
} as const;

type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

type Props = {
  navItems: NavItem[];
  memberships: Array<{
    household: {
      id: string;
      name: string;
      city: string | null;
    };
  }>;
  activeHouseholdId?: string | null;
  user: {
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

export function Sidebar({ navItems, memberships, activeHouseholdId, user }: Props) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-72 min-w-72 flex-col border-r border-border/80 bg-card/80 px-4 py-6 lg:flex">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            NotreColoc
          </Badge>
          <span className="text-sm text-muted-foreground">Pilotage quotidien</span>
        </div>
        {memberships.length > 1 ? (
          <HouseholdSwitcher memberships={memberships} activeHouseholdId={activeHouseholdId} />
        ) : memberships[0] ? (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Colocation : {memberships[0].household.name}
          </p>
        ) : null}
      </div>
      <div className="mt-8 flex h-full flex-col">
        <nav className="flex-1 space-y-1 text-sm">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-emerald-500/10",
                  isActive ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4">
          <UserMenu user={user} />
        </div>
      </div>
    </aside>
  );
}
