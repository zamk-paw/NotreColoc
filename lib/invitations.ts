import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";

const INVITE_COOKIE = "nc_invite_token";

export async function rememberInviteToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(INVITE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getRememberedInvite() {
  const cookieStore = await cookies();
  return cookieStore.get(INVITE_COOKIE)?.value ?? null;
}

export async function clearInviteCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(INVITE_COOKIE);
}

export async function acceptInvite({ token, userId }: { token: string; userId: string }) {
  const invite = await db.invite.findUnique({
    where: { token },
    include: { household: true },
  });

  if (!invite || invite.expires_at < new Date() || invite.used_at) {
    throw new Error("Invitation invalide ou expirée.");
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  if (invite.email && invite.email.toLowerCase() !== user.email.toLowerCase()) {
    throw new Error("Cette invitation est liée à une autre adresse email.");
  }

  const existingMembership = await db.membership.findUnique({
    where: {
      user_id_household_id: {
        user_id: userId,
        household_id: invite.household_id,
      },
    },
  });

  if (!existingMembership) {
    await db.membership.create({
      data: {
        user_id: userId,
        household_id: invite.household_id,
        role: invite.role,
      },
    });
  }

  await db.invite.update({
    where: { token },
    data: {
      used_at: new Date(),
      used_by: userId,
    },
  });

  await clearInviteCookie();

  return invite.household_id;
}

export function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}
