import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Montant invalide"),
  currency: z.enum(["EUR", "USD", "GBP", "CHF"]),
  label: z.string().min(2).max(120),
  paid_by: z.string().min(1),
  participants: z.array(z.string()).min(1, "Choisis au moins une personne"),
  date: z.coerce.date(),
  mode: z.enum(["equal", "shares", "amounts"]).default("equal"),
  note: z.string().max(280).optional(),
  csrfToken: z.string().min(10),
});
