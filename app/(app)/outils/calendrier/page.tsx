import { Metadata } from "next";
import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { CalendarView } from "@/components/calendar/calendar-view";
import { CreateEventDialog } from "@/components/calendar/create-event-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCsrfToken } from "@/lib/csrf";

export const metadata: Metadata = {
    title: "Calendrier | NotreColoc",
};

export default async function CalendarPage() {
    const session = await requireActiveHousehold();
    const csrfToken = (await getCsrfToken()) ?? "";

    const events = await db.calendarEvent.findMany({
        where: {
            household_id: session.active_household_id!,
        },
        include: {
            creator: {
                select: {
                    name: true,
                    avatar_url: true,
                },
            },
        },
        orderBy: {
            starts_at: "asc",
        },
    });

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Calendrier</h1>
                    <p className="text-muted-foreground">Gérez les événements de la colocation.</p>
                </div>
                <CreateEventDialog csrfToken={csrfToken}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvel événement
                    </Button>
                </CreateEventDialog>
            </div>

            <CalendarView events={events} />
        </div>
    );
}
