"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireActiveHousehold } from "@/lib/auth/session";
import { bookingSchema } from "@/lib/validations/bookings";
import { verifyCsrfToken } from "@/lib/csrf";
import { invalidateDashboardCache } from "@/lib/cache/dashboard";

export type BookingActionState = {
  error?: string;
  success?: boolean;
};

export async function createBookingAction(_: BookingActionState, formData: FormData): Promise<BookingActionState> {
  const session = await requireActiveHousehold();

  const parsed = bookingSchema.safeParse({
    resource_id: formData.get("resource_id"),
    starts_at: formData.get("starts_at"),
    ends_at: formData.get("ends_at"),
    note: formData.get("note"),
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error?.errors?.[0]?.message ?? "Données invalides." };
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    return { error: "Token CSRF invalide." };
  }

  const hasOverlap = await db.booking.findFirst({
    where: {
      household_id: session.active_household_id!,
      resource_id: parsed.data.resource_id,
      starts_at: { lt: parsed.data.ends_at },
      ends_at: { gt: parsed.data.starts_at },
    },
  });

  if (hasOverlap) {
    return { error: "Ce créneau chevauche une réservation existante." };
  }

  await db.booking.create({
    data: {
      household_id: session.active_household_id!,
      resource_id: parsed.data.resource_id,
      user_id: session.user_id,
      starts_at: parsed.data.starts_at,
      ends_at: parsed.data.ends_at,
      note: parsed.data.note,
    },
  });

  await invalidateDashboardCache(session.active_household_id!);
  revalidatePath("/accueil");
  revalidatePath("/outils/reservations");

  return { success: true };
}
