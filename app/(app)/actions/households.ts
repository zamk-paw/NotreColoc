"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { requireActiveHousehold, requireSession, setActiveHousehold } from "@/lib/auth/session";
import { createHousehold } from "@/lib/households";
import { createHouseholdSchema, currencies, weekStarts, moduleKeys } from "@/lib/validations/households";
import { invalidateDashboardCache } from "@/lib/cache/dashboard";
import { verifyCsrfToken } from "@/lib/csrf";

export async function switchHouseholdAction(householdId: string) {
  const session = await requireSession();

  const membership = await db.membership.findUnique({
    where: {
      user_id_household_id: {
        user_id: session.user_id,
        household_id: householdId,
      },
    },
  });

  if (!membership) {
    throw new Error("Accès refusé.");
  }

  await setActiveHousehold(householdId);
  revalidatePath("/accueil");
  revalidatePath("/outils");
}

type HouseholdFormPayload = Record<string, unknown> & {
  invites?: string[];
  csrfToken?: string;
};

export async function createHouseholdAction(input: FormData | HouseholdFormPayload) {
  const session = await requireSession();

  const normalized: HouseholdFormPayload =
    input instanceof FormData
      ? {
          name: input.get("name"),
          city: input.get("city"),
          timezone: input.get("timezone"),
          currency: input.get("currency"),
          week_start: input.get("week_start"),
          modules: Object.fromEntries(
            Array.from(input.keys())
              .filter((key) => key.startsWith("module:"))
              .map((key) => [key.split(":")[1], input.get(key) === "on"])
          ),
          invites: input.get("invites")?.toString().split(",").filter(Boolean) ?? [],
          csrfToken: input.get("csrfToken")?.toString(),
        }
      : input;

  const parsed = createHouseholdSchema.safeParse({
    ...normalized,
    modules: normalized.modules ?? {},
    invites: normalized.invites ?? [],
  });

  if (!parsed.success) {
    throw new Error(parsed.error?.errors?.[0]?.message ?? "Formulaire invalide.");
  }

  if (!(await verifyCsrfToken(typeof normalized.csrfToken === "string" ? normalized.csrfToken : null))) {
    throw new Error("Token CSRF invalide.");
  }

  const household = await createHousehold(session.user_id, parsed.data);
  await setActiveHousehold(household.id);
  await invalidateDashboardCache(household.id);
  revalidatePath("/accueil");
  redirect("/accueil");
}

export async function updateHouseholdSettingsAction(formData: FormData) {
  const session = await requireActiveHousehold();
  const csrfToken = formData.get("csrfToken");
  if (!(await verifyCsrfToken(csrfToken))) {
    throw new Error("Token CSRF invalide.");
  }

  const currencyEntry = formData.get("currency");
  const weekStartEntry = formData.get("week_start");
  const timezoneEntry = formData.get("timezone");

  const currency = typeof currencyEntry === "string" && currencies.includes(currencyEntry) ? currencyEntry : currencies[0];
  const weekStart =
    typeof weekStartEntry === "string" && weekStarts.includes(weekStartEntry) ? weekStartEntry : weekStarts[0];
  const timezoneValue =
    typeof timezoneEntry === "string" && timezoneEntry.length > 0 ? timezoneEntry : "Europe/Paris";

  const defaultModules = Object.fromEntries(moduleKeys.map((key) => [key, true]));

  await db.householdSettings.upsert({
    where: { household_id: session.active_household_id! },
    update: {
      currency,
      week_start: weekStart,
      timezone: timezoneValue,
      ...defaultModules,
    },
    create: {
      household_id: session.active_household_id!,
      currency,
      week_start: weekStart,
      timezone: timezoneValue,
      ...defaultModules,
    },
  });

  revalidatePath("/colocations/configuration");
  await invalidateDashboardCache(session.active_household_id!);
}

export async function changeActiveHouseholdAction(formData: FormData) {
  const householdId = formData.get("household_id");
  if (!householdId || typeof householdId !== "string") {
    throw new Error("Colocation invalide.");
  }

  if (!(await verifyCsrfToken(formData.get("csrfToken")))) {
    throw new Error("Token CSRF invalide.");
  }

  await switchHouseholdAction(householdId);
  revalidatePath("/colocations/configuration");
  redirect("/colocations/configuration");
}
