"use client";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createBookingAction, type BookingActionState } from "@/app/(app)/actions/bookings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ResourceOption = {
  id: string;
  name: string;
};

type Props = {
  resources: ResourceOption[];
  csrfToken: string;
};

const initialState: BookingActionState = {};

export function NewBookingDialog({ resources, csrfToken }: Props) {
  const [state, formAction] = useActionState(createBookingAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
          Réserver un créneau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle réservation</DialogTitle>
          <DialogDescription>Planifie un créneau pour une ressource partagée.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          action={(formData) => {
            startTransition(() => formAction(formData));
          }}
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <div className="space-y-2">
            <Label htmlFor="resource_id">Ressource</Label>
            <select
              id="resource_id"
              name="resource_id"
              required
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Sélectionner</option>
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="starts_at">Début</Label>
              <Input id="starts_at" type="datetime-local" name="starts_at" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ends_at">Fin</Label>
              <Input id="ends_at" type="datetime-local" name="ends_at" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" name="note" placeholder="Indique un contexte pour les colocataires" />
          </div>
          {state.error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement…
              </>
            ) : (
              "Réserver"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
