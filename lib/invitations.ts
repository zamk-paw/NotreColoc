import crypto from "crypto";
import { db } from "@/db";
import { clearInviteToken } from "@/lib/invite-cookie";

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

  await clearInviteToken();

  return invite.household_id;
}

export function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}
