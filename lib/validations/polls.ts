import { z } from "zod";

export const createPollSchema = z.object({
  question: z
    .string({ required_error: "Le sujet est requis." })
    .min(3, "Question trop courte.")
    .max(140, "Question trop longue."),
  description: z
    .string()
    .max(280, "Description trop longue.")
    .optional()
    .or(z.literal(""))
    .transform((val) => val || null),
  options: z
    .array(z.string().min(1).transform((value) => value.trim()))
    .transform((items) => items.filter((item) => item.length > 0))
    .refine((items) => items.length >= 2, { message: "Ajoute au moins deux options." }),
  csrfToken: z.string().min(10, "Token CSRF requis."),
});

export const votePollSchema = z.object({
  poll_id: z.string().min(1),
  option_id: z.string().min(1),
  csrfToken: z.string().min(10),
});

export type CreatePollInput = z.infer<typeof createPollSchema>;
