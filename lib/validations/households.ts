import { z } from "zod";

export const currencies = ["EUR", "USD", "GBP", "CHF"] as const;
export const weekStarts = ["mon", "sun"] as const;
export const moduleKeys = [
  "enable_meal_planning",
  "enable_laundry_booking",
  "enable_shared_expenses",
  "enable_tasks",
  "enable_calendar",
  "enable_shopping_list",
  "enable_inventory",
  "enable_announcements",
  "enable_polls",
] as const;

export const createHouseholdSchema = z.object({
  name: z
    .string({ required_error: "Le nom de la colocation est requis." })
    .min(2, "Le nom est trop court.")
    .max(60, "Le nom est trop long."),
  city: z.string().max(80).optional().or(z.literal("")).transform((v) => v || null),
  timezone: z.string().min(2),
  currency: z.enum(currencies),
  week_start: z.enum(weekStarts),
  modules: z
    .object(
      Object.fromEntries(moduleKeys.map((key) => [key, z.boolean().default(false)])) as Record<
        (typeof moduleKeys)[number],
        z.ZodType<boolean>
      >
    )
    .partial()
    .default({}) satisfies z.ZodType<Record<(typeof moduleKeys)[number], boolean>>,
  invites: z.array(z.string().email("Email invalide")).max(10).optional(),
});

export type CreateHouseholdInput = z.infer<typeof createHouseholdSchema>;
