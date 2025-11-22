import { z } from "zod";

export const bookingSchema = z.object({
  resource_id: z.string().min(1),
  starts_at: z.coerce.date(),
  ends_at: z.coerce.date(),
  note: z.string().max(280).optional(),
  csrfToken: z.string().min(10),
});
