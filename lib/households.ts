import slugify from "slugify";
import { db } from "@/db";
import type { CreateHouseholdInput } from "@/lib/validations/households";
import { moduleKeys } from "@/lib/validations/households";
import { generateInviteToken } from "@/lib/invitations";

const defaultModuleState = Object.fromEntries(moduleKeys.map((key) => [key, true])) as Record<string, boolean>;

export async function createHousehold(userId: string, payload: CreateHouseholdInput) {
  return db.$transaction(async (tx) => {
    const household = await tx.household.create({
      data: {
        name: payload.name,
        city: payload.city,
        owner_id: userId,
        settings: {
          create: {
            currency: payload.currency,
            week_start: payload.week_start,
            timezone: payload.timezone,
            ...defaultModuleState,
          },
        },
      },
    });

    await tx.membership.create({
      data: {
        user_id: userId,
        household_id: household.id,
        role: "admin",
      },
    });

    await tx.resource.create({
      data: {
        household_id: household.id,
        name: "Machine à laver",
        slug: `${slugify("Machine à laver", { lower: true })}-${household.id.slice(-4)}`,
        type: "washer",
      },
    });

    if (payload.invites && payload.invites.length > 0) {
      await tx.invite.createMany({
        data: payload.invites.map((email) => ({
          token: generateInviteToken(),
          household_id: household.id,
          email,
          created_by: userId,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        })),
      });
    }

    return household;
  });
}

export async function getHouseholdSwitcherData(userId: string) {
  return db.membership.findMany({
    where: { user_id: userId },
    include: {
      household: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });
}
