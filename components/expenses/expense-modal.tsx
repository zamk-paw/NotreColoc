"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

type Member = {
  id: string;
  name: string;
};

type Props = {
  members: Member[];
};

export function ExpenseModal({ members }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter une dépense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nouvelle dépense</DialogTitle>
          <DialogDescription>Cette fonctionnalité enregistre bientôt les transactions.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            toast.info("Bientôt disponible", {
              description: "L’ajout de dépense arrivera lors de la prochaine itération.",
            });
            setOpen(false);
          }}
        >
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
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Titre</Label>
            <Input id="label" name="label" placeholder="Courses du week-end" required />
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
                  <Checkbox defaultChecked />
                  <span>{member.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" name="note" placeholder="Détails optionnels" />
          </div>
          <Button type="submit" className="w-full">
            Simuler la dépense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
