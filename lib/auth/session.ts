import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addDays, isBefore } from "date-fns";
import { db } from "@/db";

const SESSION_COOKIE = "nc_session";
const SESSION_META_COOKIE = "nc_session_meta";
const SESSION_MAX_AGE_DAYS = 30;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildCookieOptions(remember = true) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60 } : {}),
  };
}

async function setSessionMeta(meta: { hasHousehold: boolean }) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_META_COOKIE, JSON.stringify(meta), {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export async function createSession(userId: string, activeHouseholdId?: string, options?: { remember?: boolean }) {
  const token = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = addDays(new Date(), SESSION_MAX_AGE_DAYS);

  await db.session.create({
    data: {
      user_id: userId,
      active_household_id: activeHouseholdId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, buildCookieOptions(options?.remember ?? true));
  await setSessionMeta({ hasHousehold: Boolean(activeHouseholdId) });

  return token;
}

export async function revokeSession(token: string) {
  const tokenHash = hashToken(token);
  await db.session.deleteMany({
    where: { token_hash: tokenHash },
  });
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(SESSION_META_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { token_hash: hashToken(token) },
    include: {
      user: {
        include: {
          memberships: true,
          active_household: true,
        },
      },
      active_household: true,
    },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    cookieStore.delete(SESSION_META_COOKIE);
    return null;
  }

  if (isBefore(session.expires_at, new Date())) {
    await db.session.delete({ where: { id: session.id } });
    cookieStore.delete(SESSION_COOKIE);
    cookieStore.delete(SESSION_META_COOKIE);
    return null;
  }

  return { token, ...session };
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireActiveHousehold() {
  const session = await requireSession();
  if (!session.active_household_id) {
    await setSessionMeta({ hasHousehold: false });
    redirect("/integrations");
  }

  return session;
}

export async function setActiveHousehold(householdId: string) {
  const session = await requireSession();
  await db.session.update({
    where: { id: session.id },
    data: { active_household_id: householdId },
  });
  await db.user.update({
    where: { id: session.user_id },
    data: { active_household_id: householdId },
  });

  await setSessionMeta({ hasHousehold: true });

  return householdId;
}
