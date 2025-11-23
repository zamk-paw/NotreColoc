import { requireSession } from "@/lib/auth/session";
import { getCsrfToken } from "@/lib/csrf";
import { updateNotificationAction } from "@/app/(app)/actions/account";
import { Button } from "@/components/ui/button";

export default async function NotificationsPage() {
  const session = await requireSession();
  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <form action={updateNotificationAction} className="space-y-4">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <label className="flex items-center justify-between rounded-2xl border border-border/60 p-4">
        <div>
          <p className="font-medium">Notifications de la coloc</p>
          <p className="text-xs text-muted-foreground">État des réservations, annonces et rappels.</p>
        </div>
        <input
          type="checkbox"
          name="household_notifications"
          defaultChecked={session.user.push_events ?? true}
          className="h-4 w-4 rounded border-input"
        />
      </label>
      <label className="flex items-center justify-between rounded-2xl border border-border/60 p-4">
        <div>
          <p className="font-medium">Emails marketing</p>
          <p className="text-xs text-muted-foreground">Recevoir les nouveautés du produit.</p>
        </div>
        <input
          type="checkbox"
          name="marketing_emails"
          defaultChecked={session.user.marketing_emails ?? false}
          className="h-4 w-4 rounded border-input"
        />
      </label>
      <div className="rounded-2xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        Les alertes granulaires (modules, canaux) arriveront bientôt.
      </div>
      <div className="flex justify-end">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
