"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { registerAction, type AuthActionState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  csrfToken: string;
  hasInvite?: boolean;
};

const initialState: AuthActionState = {};

export function RegisterForm({ csrfToken, hasInvite }: Props) {
  const [state, formAction] = useFormState(registerAction, initialState);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" required placeholder="Camille Dupont" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
        <p className="text-sm text-muted-foreground">Au moins 8 caractères.</p>
      </div>
      {hasInvite ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Cette inscription acceptera une invitation existante.
        </div>
      ) : null}
      {state.error ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création…
          </>
        ) : (
          "Créer mon compte"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Déjà inscrit ?{" "}
        <Link href="/login" className="text-emerald-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
