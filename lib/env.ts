import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("file:./prisma/dev.db"),
  REDIS_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET doit contenir au moins 32 caractères."),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("NotreColoc"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});
