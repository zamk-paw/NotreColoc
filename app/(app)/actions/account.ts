"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireSession } from "@/lib/auth/session";
import { profileSchema, securitySchema, notificationSchema } from "@/lib/validations/account";
import { verifyCsrfToken } from "@/lib/csrf";
import { comparePassword, hashPassword } from "@/lib/auth/password";

export async function updateProfileAction(formData: FormData) {
  const session = await requireSession();
  const parsed = profileSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phone: formData.get("phone"),
    locale: formData.get("locale"),
    timezone: formData.get("timezone"),
    date_format: formData.get("date_format"),
    time_format: formData.get("time_format"),
    theme_preference: formData.get("theme_preference"),
    accent_color: formData.get("accent_color"),
    marketing_emails: formData.get("marketing_emails") === "on",
    push_events: formData.get("push_events") === "on",
    csrfToken: formData.get("csrfToken"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error?.errors?.[0]?.message ?? "Formulaire invalide.");
  }
  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    throw new Error("Token CSRF invalide.");
  }

  await db.user.update({
    where: { id: session.user_id },
    data: {
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      phone: parsed.data.phone,
      locale: parsed.data.locale,
      timezone: parsed.data.timezone,
      date_format: parsed.data.date_format,
      time_format: parsed.data.time_format,
      theme_preference: parsed.data.theme_preference,
      accent_color: parsed.data.accent_color,
      marketing_emails: parsed.data.marketing_emails,
      push_events: parsed.data.push_events,
    },
  });
  revalidatePath("/compte/profil");
}

export async function updatePasswordAction(formData: FormData) {
  const session = await requireSession();
  const parsed = securitySchema.safeParse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm_password: formData.get("confirm_password"),
    csrfToken: formData.get("csrfToken"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error?.errors?.[0]?.message ?? "Formulaire invalide.");
  }
  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    throw new Error("Token CSRF invalide.");
  }

  const user = await db.user.findUnique({ where: { id: session.user_id } });
  if (!user || !(await comparePassword(parsed.data.current_password, user.password_hash))) {
    throw new Error("Mot de passe actuel incorrect.");
  }

  await db.user.update({
    where: { id: session.user_id },
    data: { password_hash: await hashPassword(parsed.data.new_password) },
  });
  revalidatePath("/compte/securite");
}

export async function updateNotificationAction(formData: FormData) {
  const session = await requireSession();
  const parsed = notificationSchema.safeParse({
    household_notifications: formData.get("household_notifications") === "on",
    marketing_emails: formData.get("marketing_emails") === "on",
    csrfToken: formData.get("csrfToken"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error?.errors?.[0]?.message ?? "Formulaire invalide.");
  }
  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    throw new Error("Token CSRF invalide.");
  }

  await db.user.update({
    where: { id: session.user_id },
    data: {
      marketing_emails: parsed.data.marketing_emails,
      push_events: parsed.data.household_notifications,
    },
  });
  revalidatePath("/compte/notifications");
}
