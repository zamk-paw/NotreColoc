"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { loginAction, type AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  csrfToken: string;
};

const initialState: AuthActionState = {};

export function LoginForm({ csrfToken }: Props) {
  const [state, formAction] = useFormState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Entrez vos identifiants pour accéder à votre tableau de bord.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="prenom@coloc.fr" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="********"
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" id="remember" name="remember" className="h-4 w-4 rounded border border-input" />
          <span>Se souvenir de moi</span>
        </label>
        <Link href="#" className="text-emerald-600 hover:underline">
          Mot de passe oublié ?
        </Link>
      </div>
      {state.error ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}
      <Button disabled={isPending} type="submit" className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion…
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-emerald-600 hover:underline">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
