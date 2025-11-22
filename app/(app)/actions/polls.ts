"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireActiveHousehold } from "@/lib/auth/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { createPollSchema, votePollSchema } from "@/lib/validations/polls";

export type PollActionState = {
  error?: string;
  success?: boolean;
};

export async function createPollAction(previousState: PollActionState, formData: FormData): Promise<PollActionState> {
  const session = await requireActiveHousehold();
  const options = formData.getAll("options[]").map((value) => (typeof value === "string" ? value : ""));

  const parsed = createPollSchema.safeParse({
    question: formData.get("question"),
    description: formData.get("description"),
    options,
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error?.errors?.[0]?.message ?? "Formulaire invalide." };
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    return { error: "Token CSRF invalide." };
  }

  try {
    await db.poll.create({
      data: {
        question: parsed.data.question,
        description: parsed.data.description,
        household_id: session.active_household_id!,
        created_by: session.user_id,
        options: {
          create: parsed.data.options.map((label) => ({ label })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Impossible de créer le sondage." };
  }

  revalidatePath("/outils/votes");
  revalidatePath("/accueil");
  return { success: true };
}

export async function votePollAction(formData: FormData) {
  const session = await requireActiveHousehold();
  const parsed = votePollSchema.safeParse({
    poll_id: formData.get("poll_id"),
    option_id: formData.get("option_id"),
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error?.errors?.[0]?.message ?? "Formulaire invalide.");
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    throw new Error("Token CSRF invalide.");
  }

  const poll = await db.poll.findUnique({
    where: { id: parsed.data.poll_id },
    include: { options: true },
  });

  if (!poll || poll.household_id !== session.active_household_id) {
    throw new Error("Sondage introuvable.");
  }

  const optionExists = poll.options.find((option) => option.id === parsed.data.option_id);
  if (!optionExists) {
    throw new Error("Option invalide.");
  }

  await db.pollVote.upsert({
    where: {
      poll_id_user_id: {
        poll_id: parsed.data.poll_id,
        user_id: session.user_id,
      },
    },
    update: {
      option_id: parsed.data.option_id,
    },
    create: {
      poll_id: parsed.data.poll_id,
      option_id: parsed.data.option_id,
      user_id: session.user_id,
    },
  });

  revalidatePath("/outils/votes");
  revalidatePath("/accueil");
}
