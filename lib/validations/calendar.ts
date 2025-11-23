import { z } from "zod";

export const createEventSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().optional(),
    starts_at: z.string().transform((str) => new Date(str)),
    ends_at: z.string().transform((str) => new Date(str)),
    all_day: z.boolean().optional(),
    csrfToken: z.string().optional(),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
