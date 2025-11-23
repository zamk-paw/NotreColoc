"use client";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, addDays, startOfToday, set } from "date-fns";
import { fr } from "date-fns/locale";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

  // Form state
  const [date, setDate] = useState<Date>(startOfToday());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      // Reset form defaults
      setDate(startOfToday());
      setStartTime("09:00");
      setEndTime("10:00");
    }
  }, [state.success]);

  const handleQuickDate = (daysToAdd: number) => {
    setDate(addDays(startOfToday(), daysToAdd));
  };

  // Construct full ISO strings for the hidden inputs
  const getDateTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const dateTime = set(date, { hours, minutes });
    return format(dateTime, "yyyy-MM-dd'T'HH:mm");
  };

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
          className="space-y-6"
          action={(formData) => {
            startTransition(() => formAction(formData));
          }}
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="starts_at" value={getDateTime(startTime)} />
          <input type="hidden" name="ends_at" value={getDateTime(endTime)} />

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

          <div className="space-y-3">
            <Label>Date</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={date.getTime() === startOfToday().getTime() ? "default" : "outline"}
                onClick={() => handleQuickDate(0)}
                className="flex-1"
              >
                Aujourd’hui
              </Button>
              <Button
                type="button"
                variant={date.getTime() === addDays(startOfToday(), 1).getTime() ? "default" : "outline"}
                onClick={() => handleQuickDate(1)}
                className="flex-1"
              >
                Demain
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startTime">Début</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
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
