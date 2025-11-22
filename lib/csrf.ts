'use server';

import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE = "nc_csrf";

export async function getCsrfToken() {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE)?.value ?? null;
}

export async function verifyCsrfToken(token: FormDataEntryValue | string | null) {
  if (!token || typeof token !== "string") {
    return false;
  }

  const cookieToken = await getCsrfToken();
  if (!cookieToken) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(token));
}
