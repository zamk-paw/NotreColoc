import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide").max(191),
  password: z.string().min(1, "Mot de passe requis"),
  remember: z.boolean().default(false),
  csrfToken: z.string().min(10),
});

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis." })
    .min(2, "Le nom est trop court.")
    .max(100, "Le nom est trop long."),
  email: z.string().email("Email invalide").max(191),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
    .max(100, "Le mot de passe est trop long."),
  acceptInvitation: z.boolean().default(false),
  csrfToken: z.string().min(10),
});
