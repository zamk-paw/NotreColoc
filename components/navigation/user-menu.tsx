"use client";

import { useTransition } from "react";
import { LogOut, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  user: {
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
};

export function UserMenu({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  const initials = user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl border border-border/80 px-3">
          <Avatar className="h-10 w-10">
            {user.avatar_url ? <AvatarImage src={user.avatar_url} alt={user.name ?? user.email} /> : null}
            <AvatarFallback>{initials || user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{user.name ?? "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a href="/compte/profil" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            Profil
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/compte/securite" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sécurité
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 text-destructive focus:text-destructive"
          onSelect={(event) => {
            event.preventDefault();
            startTransition(() => logoutAction());
          }}
        >
          {isPending ? <LogOut className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
