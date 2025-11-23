'use server';

import { cookies } from "next/headers";

const INVITE_COOKIE = "nc_invite_token";

export async function setInviteToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(INVITE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getInviteToken() {
  const cookieStore = await cookies();
  return cookieStore.get(INVITE_COOKIE)?.value ?? null;
}

export async function clearInviteToken() {
  const cookieStore = await cookies();
  cookieStore.delete(INVITE_COOKIE);
}
