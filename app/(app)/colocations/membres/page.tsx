import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function MembersPage() {
  const session = await requireActiveHousehold();
  const members = await db.membership.findMany({
    where: { household_id: session.active_household_id! },
    include: { user: true },
    orderBy: { created_at: "asc" },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Colocation</p>
          <h1 className="text-3xl font-semibold">Membres</h1>
          <p className="text-sm text-muted-foreground">Gère les colocataires et invite de nouvelles personnes.</p>
        </div>
        <Button asChild>
          <a href="/colocations/invitations">Inviter un membre</a>
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Liste des membres</CardTitle>
          <CardDescription>{members.length} membres actifs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tu es le premier membre de cette colocation.</p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {member.user.avatar_url ? (
                      <AvatarImage src={member.user.avatar_url} alt={member.user.name ?? member.user.email} />
                    ) : null}
                    <AvatarFallback>
                      {(member.user.name ?? member.user.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user.name ?? member.user.email}</p>
                    <a href={`mailto:${member.user.email}`} className="text-sm text-emerald-600 hover:underline">
                      {member.user.email}
                    </a>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">
                    Membre depuis {format(member.created_at, "d MMM yyyy", { locale: fr })}
                  </p>
                  {member.user_id === session.user_id ? <Badge variant="outline">Vous</Badge> : null}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
