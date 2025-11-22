import { AppShell } from "@/components/layout/app-shell";
import { requireSession } from "@/lib/auth/session";
import { getHouseholdSwitcherData } from "@/lib/households";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const memberships = await getHouseholdSwitcherData(session.user_id);
  const activeHouseholdName =
    memberships.find((membership) => membership.household.id === session.active_household_id)?.household.name ??
    memberships[0]?.household.name ??
    null;
  const hasMultipleHouseholds = memberships.length > 1;

  return (
    <AppShell
      activeHouseholdName={activeHouseholdName}
      hasMultipleHouseholds={hasMultipleHouseholds}
      user={{
        name: session.user.name,
        email: session.user.email,
        avatar_url: session.user.avatar_url,
      }}
    >
      {children}
    </AppShell>
  );
}
