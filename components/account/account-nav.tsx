"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/compte/profil", label: "Profil" },
  { href: "/compte/securite", label: "Sécurité" },
  { href: "/compte/notifications", label: "Notifications" },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-3 text-sm">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-full px-4 py-2 transition",
              active ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
