"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { requireActiveHousehold } from "@/lib/auth/session";
import { verifyCsrfToken } from "@/lib/csrf";
import { currencies } from "@/lib/validations/households";
import { z } from "zod";

const expenseSchema = z.object({
  amount: z.coerce.number().positive("Montant invalide"),
  currency: z.enum(currencies),
  label: z.string().min(2).max(120),
  payer_id: z.string().min(1),
  participants: z.array(z.string().min(1)).min(1, "Choisis au moins un participant"),
  note: z
    .string()
    .max(280)
    .optional()
    .or(z.literal(""))
    .transform((value) => value || null),
  date: z.coerce.date(),
  csrfToken: z.string().min(10),
});

export type ExpenseActionState = {
  error?: string;
  success?: boolean;
};

export async function createExpenseAction(prevState: ExpenseActionState, formData: FormData): Promise<ExpenseActionState> {
  const session = await requireActiveHousehold();

  const parsed = expenseSchema.safeParse({
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    label: formData.get("label"),
    payer_id: formData.get("payer"),
    participants: formData.getAll("participants") as string[],
    note: formData.get("note"),
    date: formData.get("date"),
    csrfToken: formData.get("csrfToken"),
  });

  if (!parsed.success) {
    return { error: parsed.error?.errors?.[0]?.message ?? "Formulaire invalide." };
  }

  if (!(await verifyCsrfToken(parsed.data.csrfToken))) {
    return { error: "Token CSRF invalide." };
  }

  if (!parsed.data.participants.includes(parsed.data.payer_id)) {
    parsed.data.participants.push(parsed.data.payer_id);
  }

  const share = parsed.data.amount / parsed.data.participants.length;

  try {
    await db.expense.create({
      data: {
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        label: parsed.data.label,
        note: parsed.data.note,
        date: parsed.data.date,
        household_id: session.active_household_id!,
        payer_id: parsed.data.payer_id,
        participants: {
          create: parsed.data.participants.map((participant) => ({
            user_id: participant,
            share,
          })),
        },
      },
    });
  } catch (error) {
    console.error("create expense", error);
    return { error: "Impossible d’enregistrer la dépense." };
  }

  revalidatePath("/outils/depenses-partagees");
  return { success: true };
}
