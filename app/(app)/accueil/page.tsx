import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarClock, Megaphone, Send, UsersRound } from "lucide-react";
import { requireActiveHousehold } from "@/lib/auth/session";
import { getDashboardSnapshot } from "@/lib/cache/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const moduleMeta: Record<string, { label: string; emoji: string }> = {
  enable_meal_planning: { label: "Repas", emoji: "🍲" },
  enable_laundry_booking: { label: "Lessive", emoji: "🧺" },
  enable_shared_expenses: { label: "Dépenses", emoji: "💶" },
  enable_tasks: { label: "Tâches", emoji: "🧽" },
  enable_calendar: { label: "Calendrier", emoji: "🗓️" },
  enable_shopping_list: { label: "Courses", emoji: "🛒" },
  enable_inventory: { label: "Inventaire", emoji: "📦" },
  enable_announcements: { label: "Annonces", emoji: "📣" },
  enable_polls: { label: "Votes", emoji: "🗳️" },
};

export default async function DashboardPage() {
  const session = await requireActiveHousehold();
  const snapshot = await getDashboardSnapshot(session.active_household_id!);
  const today = new Date();
  const heroDate = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(today);
  const activeModules = Object.entries(snapshot.modules ?? {})
    .filter(([key, value]) => key.startsWith("enable_") && value === true)
    .map(([key]) => ({ key, ...moduleMeta[key] }));

  const nextBooking = snapshot.today[0] ?? snapshot.upcoming[0];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="relative overflow-hidden border border-emerald-100 bg-white shadow-xl dark:bg-slate-900">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-200/60 via-black to-black dark:from-emerald-500/20" />
          <CardHeader className="relative z-10 space-y-2">
            <Badge variant="outline" className="w-fit border-emerald-300 bg-white/80 text-emerald-700 backdrop-blur">
              Bonjour {session.user.first_name ?? session.user.name ?? session.user.email}
            </Badge>
            <CardTitle className="text-3xl font-semibold text-slate-900 dark:text-white">Vue générale de ta colocation</CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-300">{heroDate}</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-wrap gap-4">
            <Button className="rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500" asChild>
              <a href="/outils/reservations">Planifier une réservation</a>
            </Button>
            <Button variant="outline" className="rounded-2xl border-emerald-200 text-emerald-600" asChild>
              <a href="/colocations/invitations">Inviter quelqu’un</a>
            </Button>
            <div className="ml-auto text-right text-sm">
              <p className="text-muted-foreground">Réservations aujourd’hui</p>
              <p className="text-2xl font-semibold">{snapshot.today.length}</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">Prochain créneau</p>
              <p className="text-lg font-medium">
                {nextBooking
                  ? `${format(nextBooking.starts_at, "HH:mm", { locale: fr })} • ${nextBooking.resource.name}`
                  : "Rien de prévu"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statistiques clés</CardTitle>
            <CardDescription>Activité des 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Membres" value={snapshot.stats.members} />
              <Stat label="Invitations" value={snapshot.stats.invites} />
              <Stat label="Ressources" value={snapshot.stats.resources} />
              <Stat label="Modules actifs" value={snapshot.stats.modules} />
            </div>
            <div className="flex flex-wrap gap-2">
              {activeModules.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun module activé pour l’instant.</p>
              ) : (
                activeModules.map((module) => (
                  <Badge key={module.key} variant="secondary" className="gap-2 bg-emerald-100 text-emerald-700">
                    <span>{module.emoji}</span>
                    {module.label}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Aujourd’hui</CardTitle>
              <CardDescription>Réservations pour le {format(today, "EEEE d MMMM", { locale: fr })}</CardDescription>
            </CardHeader>
            <CardContent>
              {snapshot.today.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-muted-foreground/20 p-6 text-center">
                  <p className="text-sm text-muted-foreground">Pas de créneau prévu.</p>
                  <Button variant="link" asChild>
                    <a href="/outils/reservations">Gérer les créneaux</a>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {snapshot.today.map((booking) => (
                    <li key={booking.id} className="rounded-2xl border border-border/70 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-medium">{booking.resource.name}</p>
                        <span className="text-muted-foreground">
                          {format(booking.starts_at, "HH:mm", { locale: fr })} –{" "}
                          {format(booking.ends_at, "HH:mm", { locale: fr })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{booking.user.name ?? booking.user.email}</p>
                      {booking.note ? <p className="text-xs text-muted-foreground">{booking.note}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>À venir (7 jours)</CardTitle>
              <CardDescription>Prochains créneaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot.upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Rien de planifié pour les 7 prochains jours.</p>
              ) : (
                snapshot.upcoming.map((booking) => (
                  <div key={booking.id} className="rounded-2xl border border-border/70 p-3">
                    <p className="text-sm font-medium">{format(booking.starts_at, "EEEE d MMMM", { locale: fr })}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(booking.starts_at, "HH:mm", { locale: fr })} – {format(booking.ends_at, "HH:mm", { locale: fr })}
                    </p>
                    <p className="text-sm">{booking.resource.name}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Santé de la coloc</CardTitle>
              <CardDescription>Résumé de la semaine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <HealthItem label="Réservations (7j)" value={snapshot.today.length + snapshot.upcoming.length} />
              <HealthItem label="Modules actifs" value={snapshot.stats.modules} />
              <HealthItem label="Invitations en attente" value={snapshot.stats.invites} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickAction href="/outils/reservations" icon={CalendarClock} label="Programmer un créneau" />
              <QuickAction href="/colocations/invitations" icon={Send} label="Partager une invitation" />
              <QuickAction href="/colocations/membres" icon={UsersRound} label="Vérifier les membres" />
              <QuickAction href="/outils/votes" icon={Megaphone} label="Créer un sondage" />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/70 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function HealthItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof CalendarClock;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border/70 px-3 py-2 text-sm font-medium transition hover:border-emerald-200"
    >
      <Icon className="h-4 w-4 text-emerald-600" />
      {label}
    </a>
  );
}
