import { AppShell } from "@/components/layout/app-shell";
import { requireSession } from "@/lib/auth/session";
import { getHouseholdSwitcherData } from "@/lib/households";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const memberships = await getHouseholdSwitcherData(session.user_id);

  return (
    <AppShell
      memberships={memberships}
      activeHouseholdId={session.active_household_id ?? memberships[0]?.household.id ?? null}
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
