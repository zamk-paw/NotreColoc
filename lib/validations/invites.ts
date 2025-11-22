import { z } from "zod";

export const inviteSchema = z.object({
  email: z.string().email("Email invalide").max(191).optional().or(z.literal("")).transform((v) => v || null),
  expires_at: z.coerce.date().optional(),
  csrfToken: z.string().min(10),
});
