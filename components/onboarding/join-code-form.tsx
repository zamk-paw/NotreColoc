"use client";

import { useTransition } from "react";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { joinWithCodeAction, type JoinState } from "@/app/(onboarding)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  csrfToken: string;
};

const initialState: JoinState = {};

export function JoinCodeForm({ csrfToken }: Props) {
  const [state, formAction] = useActionState(joinWithCodeAction, initialState);
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
        <Label htmlFor="code">Code d’invitation</Label>
        <Input id="code" name="code" placeholder="Ex : 83f1ac..." required />
      </div>
      {state.error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Vérification…
          </>
        ) : (
          "Rejoindre"
        )}
      </Button>
    </form>
  );
}
