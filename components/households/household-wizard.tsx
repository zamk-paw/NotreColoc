"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createHouseholdAction } from "@/app/(app)/actions/households";
import { moduleKeys, currencies, weekStarts } from "@/lib/validations/households";

const timezones = [
  "Europe/Paris",
  "Europe/Brussels",
  "Europe/Geneva",
  "America/Montreal",
  "Europe/London",
];

type Step = 0 | 1 | 2;

const defaultModules = moduleKeys.reduce(
  (acc, key) => ({
    ...acc,
    [key]: key === "enable_laundry_booking" || key === "enable_shared_expenses",
  }),
  {} as Record<(typeof moduleKeys)[number], boolean>
);

type Props = {
  csrfToken: string;
};

export function HouseholdWizard({ csrfToken }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [invites, setInvites] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [modules, setModules] = useState<Record<string, boolean>>(defaultModules);

  const handleAddInvite = () => {
    if (!emailInput) return;
    setInvites((prev) => (prev.includes(emailInput) ? prev : [...prev, emailInput]));
    setEmailInput("");
  };

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        formData.set("invites", invites.join(","));
        await createHouseholdAction(formData);
      }}
      className="rounded-3xl border border-border/80 bg-card/70 p-6 shadow-sm"
    >
      <input type="hidden" name="invites" value={invites.join(",")} />
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <header className="mb-8">
        <p className="text-sm uppercase text-muted-foreground">Étape {step + 1} sur 3</p>
        <h1 className="text-2xl font-semibold">Création de ta colocation</h1>
        <div className="mt-4 flex items-center gap-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${index <= step ? "bg-emerald-500" : "bg-muted"}`}
            />
          ))}
        </div>
      </header>

      <section className={step === 0 ? "space-y-4" : "hidden"}>
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la colocation</Label>
          <Input id="name" name="name" required placeholder="Maison des Tilleuls" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" placeholder="Paris" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <select
              id="timezone"
              name="timezone"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <select
              id="currency"
              name="currency"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="week_start">Début de semaine</Label>
            <select
              id="week_start"
              name="week_start"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            >
              {weekStarts.map((start) => (
                <option key={start} value={start}>
                  {start === "mon" ? "Lundi" : "Dimanche"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className={step === 1 ? "space-y-4" : "hidden"}>
        <p className="text-sm text-muted-foreground">Active les modules qui t’intéressent.</p>
        <div className="grid gap-4 sm:grid-cols-2">
              {moduleKeys.map((key) => (
                <label key={key} className="flex items-start justify-between rounded-2xl border border-border/70 p-4">
                  <div>
                    <p className="font-medium capitalize">{key.replace("enable_", "").replace("_", " ")}</p>
                    <p className="text-xs text-muted-foreground">Module prêt pour ta colocation.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={modules[key]}
                      onCheckedChange={(checked) =>
                        setModules((prev) => ({
                          ...prev,
                          [key]: Boolean(checked),
                        }))
                      }
                      aria-label={`Activer ${key}`}
                    />
                    <input type="hidden" name={`module:${key}`} value={modules[key] ? "on" : ""} />
                  </div>
                </label>
              ))}
        </div>
      </section>

      <section className={step === 2 ? "space-y-4" : "hidden"}>
        <div className="space-y-2">
          <Label>Inviter des colocataires</Label>
          <div className="flex gap-2">
            <Input
              placeholder="email@exemple.fr"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
            />
            <Button type="button" onClick={handleAddInvite}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
          <Textarea readOnly value={invites.join(", ")} placeholder="Les invitations apparaîtront ici." />
          <div className="flex flex-wrap gap-2">
            {invites.map((invite) => (
              <span key={invite} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                {invite}
                <button
                  type="button"
                  onClick={() => setInvites((prev) => prev.filter((item) => item !== invite))}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((prev) => (prev - 1) as Step)}>
          Retour
        </Button>
        {step < 2 ? (
          <Button type="button" onClick={() => setStep((prev) => (prev + 1) as Step)}>
            Suivant
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création…
              </>
            ) : (
              "Finaliser"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
