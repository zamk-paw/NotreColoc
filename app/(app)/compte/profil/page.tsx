import { requireSession } from "@/lib/auth/session";
import { getCsrfToken } from "@/lib/csrf";
import { updateProfileAction } from "@/app/(app)/actions/account";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default async function ProfilePage() {
  const session = await requireSession();
  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <form action={updateProfileAction} className="space-y-4">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input id="first_name" name="first_name" defaultValue={session.user.first_name ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input id="last_name" name="last_name" defaultValue={session.user.last_name ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" defaultValue={session.user.phone ?? ""} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="locale">Langue</Label>
          <Input id="locale" name="locale" defaultValue={session.user.locale ?? "fr-FR"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Fuseau</Label>
          <Input id="timezone" name="timezone" defaultValue={session.user.timezone ?? "Europe/Paris"} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date_format">Format de date</Label>
          <Input id="date_format" name="date_format" defaultValue={session.user.date_format ?? "dd/MM/yyyy"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time_format">Format d’heure</Label>
          <Input id="time_format" name="time_format" defaultValue={session.user.time_format ?? "HH:mm"} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="theme_preference">Thème</Label>
          <select
            id="theme_preference"
            name="theme_preference"
            defaultValue={session.user.theme_preference ?? "system"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
          >
            <option value="system">Système</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="accent_color">Couleur d’accent</Label>
          <Input id="accent_color" name="accent_color" defaultValue={session.user.accent_color ?? "emerald"} />
        </div>
      </div>
      <label className="flex items-center gap-3">
        <input type="checkbox" name="marketing_emails" defaultChecked={session.user.marketing_emails ?? false} className="h-4 w-4 rounded border border-input" />
        <span>Recevoir les emails d’actualité</span>
      </label>
      <label className="flex items-center gap-3">
        <input type="checkbox" name="push_events" defaultChecked={session.user.push_events ?? true} className="h-4 w-4 rounded border border-input" />
        <span>Notifications pour les événements de la coloc</span>
      </label>
      <div className="flex justify-end">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
