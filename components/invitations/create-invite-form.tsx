"use client";

import { useTransition } from "react";
import { useFormState } from "react-dom";
import { Loader2 } from "lucide-react";
import { createInviteAction, type InviteActionState } from "@/app/(app)/actions/invitations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  csrfToken: string;
};

const initialState: InviteActionState = {};

export function CreateInviteForm({ csrfToken }: Props) {
  const [state, formAction] = useFormState(createInviteAction, initialState);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      action={(formData) => {
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <div className="space-y-2">
        <Label htmlFor="email">Email cible (optionnel)</Label>
        <Input id="email" name="email" type="email" placeholder="ami@exemple.fr" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expires_at">Expiration</Label>
        <Input id="expires_at" name="expires_at" type="date" />
      </div>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération…
          </>
        ) : (
          "Générer le lien"
        )}
      </Button>
    </form>
  );
}
