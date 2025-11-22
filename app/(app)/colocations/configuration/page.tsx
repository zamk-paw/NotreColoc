import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { getCsrfToken } from "@/lib/csrf";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { moduleKeys, currencies, weekStarts } from "@/lib/validations/households";
import { updateHouseholdSettingsAction, changeActiveHouseholdAction } from "@/app/(app)/actions/households";

export default async function HouseholdSettingsPage() {
  const session = await requireActiveHousehold();
  const settings =
    (await db.householdSettings.findUnique({
      where: { household_id: session.active_household_id! },
    })) ??
    (await db.householdSettings.create({
      data: {
        household_id: session.active_household_id!,
      },
    }));
  const memberships = await db.membership.findMany({
    where: { user_id: session.user_id },
    include: {
      household: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
    orderBy: { created_at: "asc" },
  });

  const csrfToken = (await getCsrfToken()) ?? "";
  const hasMultipleHouseholds = memberships.length > 1;
  const activeHouseholdId = session.active_household_id ?? memberships[0]?.household.id ?? "";

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase text-muted-foreground">Colocation</p>
        <h1 className="text-3xl font-semibold">Configuration générale</h1>
        <p className="text-sm text-muted-foreground">Gère les préférences globales et les modules disponibles.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Colocation sélectionnée</CardTitle>
          <CardDescription>Choisis la colocation à configurer depuis cette page.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={changeActiveHouseholdAction} className="space-y-4">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <div className="space-y-2">
              <Label htmlFor="household_id">Colocation</Label>
              <select
                id="household_id"
                name="household_id"
                defaultValue={activeHouseholdId}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                {memberships.map((membership) => (
                  <option key={membership.household.id} value={membership.household.id}>
                    {membership.household.name}
                    {membership.household.city ? ` — ${membership.household.city}` : ""}
                  </option>
                ))}
              </select>
            </div>
            {!hasMultipleHouseholds ? (
              <p className="text-sm text-muted-foreground">
                Tu n’as qu’une seule colocation pour le moment. Ajoute-en une nouvelle pour basculer rapidement.
              </p>
            ) : null}
            <Button type="submit" disabled={!hasMultipleHouseholds}>
              Changer de colocation
            </Button>
          </form>
        </CardContent>
      </Card>
      <form action={updateHouseholdSettingsAction} className="space-y-6">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <Card>
          <CardHeader>
            <CardTitle>Préférences générales</CardTitle>
            <CardDescription>Devise, début de semaine et fuseau.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <select
                id="currency"
                name="currency"
                defaultValue={settings.currency}
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
                defaultValue={settings.week_start}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                {weekStarts.map((week) => (
                  <option key={week} value={week}>
                    {week === "mon" ? "Lundi" : "Dimanche"}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Input id="timezone" name="timezone" defaultValue={settings.timezone} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Modules NotreColoc</CardTitle>
            <CardDescription>Les outils essentiels sont disponibles automatiquement.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {moduleKeys.map((module) => (
              <div key={module} className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                <p className="font-medium capitalize">{module.replace("enable_", "").replace("_", " ")}</p>
                <p className="text-xs text-muted-foreground">Activé par défaut, libre à chacun de l’utiliser.</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button type="reset" variant="ghost">
            Ignorer
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </div>
  );
}
