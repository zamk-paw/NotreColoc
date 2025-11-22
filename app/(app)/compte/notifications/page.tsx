import { requireSession } from "@/lib/auth/session";
import { getCsrfToken } from "@/lib/csrf";
import { updateNotificationAction } from "@/app/(app)/actions/account";
import { Button } from "@/components/ui/button";
import { ModuleToggleField } from "@/components/households/module-toggle-field";

export default async function NotificationsPage() {
  const session = await requireSession();
  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <form action={updateNotificationAction} className="space-y-4">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <ModuleToggleField
        name="household_notifications"
        label="Notifications de la coloc"
        description="État des réservations, annonces et rappels."
        defaultChecked={session.user.push_events ?? true}
      />
      <ModuleToggleField
        name="marketing_emails"
        label="Emails marketing"
        description="Recevoir les nouveautés du produit."
        defaultChecked={session.user.marketing_emails ?? false}
      />
      <div className="rounded-2xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        Les alertes granulaires (modules, canaux) arriveront bientôt.
      </div>
      <div className="flex justify-end">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
