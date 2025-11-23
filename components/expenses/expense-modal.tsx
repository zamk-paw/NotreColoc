"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createExpenseAction, type ExpenseActionState } from "@/app/(app)/actions/expenses";

const initialState: ExpenseActionState = {};

type Member = {
  id: string;
  name: string;
};

type Props = {
  members: Member[];
  csrfToken: string;
};

export function ExpenseModal({ members, csrfToken }: Props) {
  const [state, formAction, pending] = useActionState(createExpenseAction, initialState);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success) {
      toast.success("Dépense ajoutée", { description: "Tout le monde a été pris en compte." });
    }
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ajouter une dépense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nouvelle dépense</DialogTitle>
          <DialogDescription>Enregistre un achat pour la colocation.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={formAction}>
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input id="amount" name="amount" placeholder="54,80" type="number" min="0" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <select
                id="currency"
                name="currency"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                {["EUR", "USD", "GBP", "CHF"].map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Titre</Label>
            <Input id="label" name="label" placeholder="Courses du week-end" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payer">Qui a payé ?</Label>
            <select
              id="payer"
              name="payer"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Participants</Label>
            <div className="grid grid-cols-2 gap-3">
              {members.map((member) => (
                <label key={member.id} className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" name="participants" value={member.id} defaultChecked />
                  <span>{member.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" name="note" placeholder="Détails optionnels" />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Enregistrement…" : "Ajouter la dépense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
