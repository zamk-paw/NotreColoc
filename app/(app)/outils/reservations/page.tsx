import { addDays, endOfDay, endOfWeek, format, formatISO, isToday, startOfDay, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NewBookingDialog } from "@/components/bookings/new-booking-dialog";
import { getCsrfToken } from "@/lib/csrf";

type Props = {
  searchParams: Promise<{ week?: string }>;
};

export default async function ReservationsPage(props: Props) {
  const searchParams = await props.searchParams;
  const session = await requireActiveHousehold();
  const initialDate = searchParams.week ? new Date(searchParams.week) : new Date();
  const start = startOfWeek(initialDate, { weekStartsOn: 1 });
  const end = endOfWeek(start, { weekStartsOn: 1 });

  const [bookings, resources] = await Promise.all([
    db.booking.findMany({
      where: {
        household_id: session.active_household_id!,
        starts_at: { gte: start, lte: endOfDay(end) },
      },
      include: {
        user: true,
        resource: true,
      },
      orderBy: { starts_at: "asc" },
    }),
    db.resource.findMany({
      where: { household_id: session.active_household_id! },
      orderBy: { name: "asc" },
    }),
  ]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    return {
      date,
      label: format(date, "EEEE d MMM", { locale: fr }),
      bookings: bookings.filter((booking) => {
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);
        return booking.starts_at >= dayStart && booking.starts_at <= dayEnd;
      }),
    };
  });

  const prevWeek = formatISO(addDays(start, -7), { representation: "date" });
  const nextWeek = formatISO(addDays(start, 7), { representation: "date" });
  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Réservations</p>
          <h1 className="text-2xl font-semibold">Planning hebdomadaire</h1>
          <p className="text-sm text-muted-foreground">
            {format(start, "d MMM", { locale: fr })} – {format(end, "d MMM yyyy", { locale: fr })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <a href={`?week=${prevWeek}`}>
              <ChevronLeft className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={`?week=${nextWeek}`}>
              <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="?">Cette semaine</a>
          </Button>
          <NewBookingDialog
            resources={resources.map((resource) => ({ id: resource.id, name: resource.name }))}
            csrfToken={csrfToken}
          />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vue mobile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:hidden">
            {days.map((day) => (
              <div
                key={day.label}
                className={cn(
                  "rounded-2xl border border-border/70 p-4",
                  isToday(day.date) ? "border-emerald-200 bg-emerald-50/50" : ""
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium capitalize">{day.label}</p>
                  {isToday(day.date) ? <span className="text-xs text-emerald-600">Aujourd’hui</span> : null}
                </div>
                {day.bookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune réservation.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {day.bookings.map((booking) => (
                      <li key={booking.id} className="rounded-xl border border-border/80 p-3">
                        <p className="text-sm font-medium">{booking.resource.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(booking.starts_at, "HH:mm", { locale: fr })} –{" "}
                          {format(booking.ends_at, "HH:mm", { locale: fr })}
                        </p>
                        <p className="text-xs text-muted-foreground">{booking.user.name ?? booking.user.email}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
          <CardContent className="hidden lg:block">
            <div className="grid grid-cols-7 gap-4">
              {days.map((day) => (
                <div key={day.label} className="space-y-3">
                  <div className="rounded-xl border border-border/70 px-2 py-1 text-center text-sm font-medium capitalize">
                    {day.label}
                  </div>
                  <div className="space-y-2">
                    {day.bookings.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border/70 p-3 text-center text-xs text-muted-foreground">
                        Libre
                      </div>
                    ) : (
                      day.bookings.map((booking) => (
                        <div key={booking.id} className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2 text-xs">
                          <p className="font-medium">{booking.resource.name}</p>
                          <p>
                            {format(booking.starts_at, "HH:mm", { locale: fr })} –{" "}
                            {format(booking.ends_at, "HH:mm", { locale: fr })}
                          </p>
                          <p className="text-muted-foreground">{booking.user.name ?? booking.user.email}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
