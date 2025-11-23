"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireActiveHousehold } from "@/lib/auth/session";
import { createEventSchema } from "@/lib/validations/calendar";
import { verifyCsrfToken } from "@/lib/csrf";

export type CalendarActionState = {
    error?: string;
    success?: boolean;
};

export async function createEventAction(_: CalendarActionState, formData: FormData): Promise<CalendarActionState> {
    const session = await requireActiveHousehold();

    const rawData = {
        title: formData.get("title"),
        description: formData.get("description"),
        starts_at: formData.get("starts_at"),
        ends_at: formData.get("ends_at"),
        all_day: formData.get("all_day") === "on",
        csrfToken: formData.get("csrfToken"),
    };

    const parsed = createEventSchema.safeParse(rawData);

    if (!parsed.success) {
        return { error: parsed.error.errors[0].message };
    }

    if (parsed.data.csrfToken && !(await verifyCsrfToken(parsed.data.csrfToken))) {
        return { error: "Token CSRF invalide." };
    }

    await db.calendarEvent.create({
        data: {
            household_id: session.active_household_id!,
            created_by: session.user_id,
            title: parsed.data.title,
            description: parsed.data.description,
            starts_at: parsed.data.starts_at,
            ends_at: parsed.data.ends_at,
            all_day: parsed.data.all_day ?? false,
        },
    });

    revalidatePath("/outils/calendrier");
    return { success: true };
}

export async function deleteEventAction(eventId: string) {
    const session = await requireActiveHousehold();

    const event = await db.calendarEvent.findUnique({
        where: { id: eventId },
    });

    if (!event || event.household_id !== session.active_household_id) {
        throw new Error("Événement introuvable ou accès refusé.");
    }

    await db.calendarEvent.delete({
        where: { id: eventId },
    });

    revalidatePath("/outils/calendrier");
}
