import { db } from "@/db";

export function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } });
}

export function getUserWithMemberships(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { household: true },
      },
      active_household: true,
    },
  });
}
