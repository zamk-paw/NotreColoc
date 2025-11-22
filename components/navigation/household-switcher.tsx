"use client";

import { useTransition } from "react";
import { ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { switchHouseholdAction } from "@/app/(app)/actions/households";
import Link from "next/link";

type Membership = {
  household: {
    id: string;
    name: string;
    city: string | null;
  };
};

type Props = {
  memberships: Membership[];
  activeHouseholdId?: string | null;
};

export function HouseholdSwitcher({ memberships, activeHouseholdId }: Props) {
  const [isPending, startTransition] = useTransition();
  const active = memberships.find((m) => m.household.id === activeHouseholdId)?.household ?? memberships[0]?.household;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-background">
          <span className="text-left">
            <span className="block text-sm font-medium">{active?.name ?? "Ta colocation"}</span>
            <span className="text-xs text-muted-foreground">
              {active?.city ?? `${memberships.length} coloc${memberships.length > 1 ? "s" : ""}`}
            </span>
          </span>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsUpDown className="h-4 w-4 opacity-50" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel>Choisir une colocation</DropdownMenuLabel>
        {memberships.map((membership) => (
          <DropdownMenuItem
            key={membership.household.id}
            className="flex-col items-start"
            onSelect={(event) => {
              event.preventDefault();
              if (membership.household.id === active?.id) return;
              startTransition(() => switchHouseholdAction(membership.household.id));
            }}
          >
            <span className="text-sm font-medium">
              {membership.household.name}
              {membership.household.id === active?.id ? " (active)" : ""}
            </span>
            <span className="text-xs text-muted-foreground">{membership.household.city ?? "Sans ville"}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/colocations/creer" className="flex w-full items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle colocation
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
