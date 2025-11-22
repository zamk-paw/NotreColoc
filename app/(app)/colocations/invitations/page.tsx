import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { getCsrfToken } from "@/lib/csrf";
import { CreateInviteForm } from "@/components/invitations/create-invite-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/invitations/copy-button";

export default async function InvitationsPage() {
  const session = await requireActiveHousehold();
  const invites = await db.invite.findMany({
    where: { household_id: session.active_household_id!, used_at: null },
    orderBy: { created_at: "desc" },
  });
  const csrfToken = (await getCsrfToken()) ?? "";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase text-muted-foreground">Colocation</p>
        <h1 className="text-3xl font-semibold">Invitations</h1>
        <p className="text-sm text-muted-foreground">Génère des liens sécurisés pour inviter des colocataires.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Créer une invitation</CardTitle>
            <CardDescription>Optionnellement pour une personne spécifique.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateInviteForm csrfToken={csrfToken} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Liens actifs</CardTitle>
            <CardDescription>{invites.length} invites en attente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invites.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune invitation active.</p>
            ) : (
              invites.map((invite) => {
                const inviteUrl = `${baseUrl}/i?t=${invite.token}`;
                return (
                  <div key={invite.token} className="rounded-2xl border border-border/70 p-4 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{invite.email ?? "Ouvert"}</p>
                      <p className="text-xs text-muted-foreground">
                        Expire dans {formatDistanceToNow(invite.expires_at, { locale: fr })}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">Créé le {invite.created_at.toLocaleDateString("fr-FR")}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <CopyButton value={inviteUrl} label="Copier le lien" />
                      <CopyButton value={invite.token} label="Copier le code" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
