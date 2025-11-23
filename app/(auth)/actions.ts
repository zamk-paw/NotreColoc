"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { getUserByEmail } from "@/lib/auth/user";
import { comparePassword, hashPassword } from "@/lib/auth/password";
import { createSession, revokeSession } from "@/lib/auth/session";
import { acceptInvite } from "@/lib/invitations";
import { getInviteToken } from "@/lib/invite-cookie";
import { verifyCsrfToken } from "@/lib/csrf";

export type AuthActionState = {
  success?: boolean;
  error?: string;
};

const authLimiterWindow = 60 * 5; // 5 minutes

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limiter = await rateLimit({ key: `login:${ip}`, limit: 5, window: authLimiterWindow });
  if (!limiter.success) {
    return { error: "Trop de tentatives, réessaie dans quelques minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on",
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error?.issues?.[0]?.message ?? "Formulaire invalide." };
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    return { error: "Token CSRF invalide." };
  }

  const user = await getUserByEmail(parsed.data.email.toLowerCase());
  if (!user) {
    return { error: "Identifiants incorrects." };
  }

  const isValid = await comparePassword(parsed.data.password, user.password_hash);
  if (!isValid) {
    return { error: "Identifiants incorrects." };
  }

  const activeHouseholdId = await resolveActiveHousehold(user.id);

  await createSession(user.id, activeHouseholdId ?? undefined, { remember: parsed.data.remember });

  redirect(activeHouseholdId ? "/accueil" : "/integrations");
}

export async function registerAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limiter = await rateLimit({ key: `register:${ip}`, limit: 5, window: authLimiterWindow });
  if (!limiter.success) {
    return { error: "Trop de tentatives, réessaie dans quelques minutes." };
  }

  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error?.issues?.[0]?.message ?? "Formulaire invalide." };
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    return { error: "Token CSRF invalide." };
  }

  const existing = await getUserByEmail(parsed.data.email.toLowerCase());
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const existingUsername = await db.user.findUnique({
    where: { username: parsed.data.username },
  });

  if (existingUsername) {
    return { error: "Ce nom d'utilisateur est déjà pris." };
  }

  const user = await db.user.create({
    data: {
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      username: parsed.data.username,
      name: `${parsed.data.firstName} ${parsed.data.lastName}`,
      email: parsed.data.email.toLowerCase(),
      password_hash: await hashPassword(parsed.data.password),
    },
  });

  const activeHouseholdId = await resolveActiveHousehold(user.id);
  await createSession(user.id, activeHouseholdId ?? undefined);

  redirect(activeHouseholdId ? "/accueil" : "/integrations");
}

export async function logoutAction() {
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie");
  const token = cookieHeader?.match(/nc_session=([^;]+)/)?.[1];
  if (token) {
    await revokeSession(token);
  }
  redirect("/login");
}

async function resolveActiveHousehold(userId: string) {
  const pendingInvite = await getInviteToken();
  if (pendingInvite) {
    try {
      const householdId = await acceptInvite({ token: pendingInvite, userId });
      await db.user.update({
        where: { id: userId },
        data: { active_household_id: householdId },
      });
      return householdId;
    } catch (error) {
      console.error("Erreur d’invitation", error);
    }
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { memberships: true },
  });

  const fallbackHousehold = user?.active_household_id ?? user?.memberships[0]?.household_id ?? null;

  if (fallbackHousehold) {
    await db.user.update({
      where: { id: userId },
      data: { active_household_id: fallbackHousehold },
    });
  }

  return fallbackHousehold;
}
