import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().max(100).optional().or(z.literal("")).transform((v) => v || null),
  last_name: z.string().max(100).optional().or(z.literal("")).transform((v) => v || null),
  phone: z.string().max(30).optional().or(z.literal("")).transform((v) => v || null),
  locale: z.string().default("fr-FR"),
  timezone: z.string().default("Europe/Paris"),
  date_format: z.string().default("dd/MM/yyyy"),
  time_format: z.string().default("HH:mm"),
  theme_preference: z.enum(["system", "light", "dark"]),
  accent_color: z.string().default("emerald"),
  marketing_emails: z.boolean().default(false),
  push_events: z.boolean().default(true),
  csrfToken: z.string().min(10),
});

export const securitySchema = z.object({
  current_password: z.string().min(1, "Mot de passe actuel requis."),
  new_password: z.string().min(8, "Min 8 caractères."),
  confirm_password: z.string().min(8),
  csrfToken: z.string().min(10),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirm_password"],
});

export const notificationSchema = z.object({
  household_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
  csrfToken: z.string().min(10),
});
