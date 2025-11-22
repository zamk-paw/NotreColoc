"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession, setActiveHousehold } from "@/lib/auth/session";
import { acceptInvite } from "@/lib/invitations";
import { verifyCsrfToken } from "@/lib/csrf";

const joinSchema = z.object({
  code: z.string().min(6, "Code invalide."),
  csrfToken: z.string().min(10),
});

export type JoinState = {
  error?: string;
};

export async function joinWithCodeAction(_: JoinState, formData: FormData): Promise<JoinState> {
  const session = await requireSession();
  const parsed = joinSchema.safeParse({
    code: formData.get("code"),
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error?.errors?.[0]?.message ?? "Code invalide." };
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    return { error: "Token CSRF invalide." };
  }

  try {
    const householdId = await acceptInvite({ token: parsed.data.code, userId: session.user_id });
    await setActiveHousehold(householdId);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Impossible de rejoindre la colocation." };
  }

  redirect("/accueil");
}
