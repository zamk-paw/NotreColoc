"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireActiveHousehold } from "@/lib/auth/session";
import { inviteSchema } from "@/lib/validations/invites";
import { generateInviteToken } from "@/lib/invitations";
import { verifyCsrfToken } from "@/lib/csrf";

export type InviteActionState = {
  error?: string;
  success?: boolean;
};

export async function createInviteAction(_: InviteActionState, formData: FormData): Promise<InviteActionState> {
  const session = await requireActiveHousehold();

  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    expires_at: formData.get("expires_at"),
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error?.errors?.[0]?.message ?? "Email invalide." };
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    return { error: "Token CSRF invalide." };
  }

  await db.invite.create({
    data: {
      token: generateInviteToken(),
      household_id: session.active_household_id!,
      email: parsed.data.email,
      created_by: session.user_id,
      expires_at: parsed.data.expires_at ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  revalidatePath("/colocations/invitations");
  return { success: true };
}
