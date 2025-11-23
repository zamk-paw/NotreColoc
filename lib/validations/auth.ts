import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide").max(191),
  password: z.string().min(1, "Mot de passe requis"),
  remember: z.boolean().default(false),
  csrfToken: z.string().min(10),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis.")
    .min(2, "Le prénom est trop court.")
    .max(100, "Le prénom est trop long."),
  lastName: z
    .string()
    .min(1, "Le nom est requis.")
    .min(2, "Le nom est trop court.")
    .max(100, "Le nom est trop long."),
  username: z
    .string()
    .min(1, "Le nom d'utilisateur est requis.")
    .min(3, "Le nom d'utilisateur est trop court.")
    .max(30, "Le nom d'utilisateur est trop long.")
    .regex(/^[^\s]+$/, "Le nom d'utilisateur ne doit pas contenir d'espace."),
  email: z.string().email("Email invalide").max(191),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères.")
    .max(100, "Le mot de passe est trop long."),
  acceptInvitation: z.boolean().default(false),
  csrfToken: z.string().min(10),
});
