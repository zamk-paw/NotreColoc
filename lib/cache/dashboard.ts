import { cache } from "react";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { db } from "@/db";
import { safeRedis } from "@/lib/redis";

const DASHBOARD_TTL = 90; // seconds

export const getDashboardSnapshot = cache(async (householdId: string) => {
  const cacheKey = `accueil:coloc:${householdId}:v1`;
  const cached = await safeRedis((client) => client.get(cacheKey));
  if (cached) {
    return JSON.parse(cached) as DashboardSnapshot;
  }

  const now = new Date();

  const [membersCount, activeInvites, resources, settings, todaysBookings, upcomingBookings] = await Promise.all([
    db.membership.count({ where: { household_id: householdId } }),
    db.invite.count({ where: { household_id: householdId, used_at: null, expires_at: { gt: now } } }),
    db.resource.count({ where: { household_id: householdId } }),
    db.householdSettings.findUnique({ where: { household_id: householdId } }),
    db.booking.findMany({
      where: {
        household_id: householdId,
        starts_at: { gte: startOfDay(now), lte: endOfDay(now) },
      },
      include: { user: true, resource: true },
      orderBy: { starts_at: "asc" },
    }),
    db.booking.findMany({
      where: {
        household_id: householdId,
        starts_at: { gt: endOfDay(now), lte: addDays(endOfDay(now), 7) },
      },
      include: { user: true, resource: true },
      orderBy: { starts_at: "asc" },
    }),
  ]);

  const snapshot: DashboardSnapshot = {
    stats: {
      members: membersCount,
      invites: activeInvites,
      resources,
      modules: settings ? countEnabledModules(settings) : 0,
    },
    modules: settings ?? null,
    today: todaysBookings,
    upcoming: upcomingBookings,
  };

  await safeRedis((client) => client.setex(cacheKey, DASHBOARD_TTL, JSON.stringify(snapshot)));

  return snapshot;
});

type DashboardSnapshot = {
  stats: {
    members: number;
    invites: number;
    resources: number;
    modules: number;
  };
  modules: Record<string, boolean> | null;
  today: Array<
    Awaited<ReturnType<typeof db.booking.findMany>>[number]
  >;
  upcoming: Array<
    Awaited<ReturnType<typeof db.booking.findMany>>[number]
  >;
};

function countEnabledModules(settings: Record<string, unknown>) {
  return Object.entries(settings).filter(([key, value]) => key.startsWith("enable_") && value === true).length;
}

export async function invalidateDashboardCache(householdId: string) {
  const cacheKey = `accueil:coloc:${householdId}:v1`;
  await safeRedis((client) => client.del(cacheKey));
}
