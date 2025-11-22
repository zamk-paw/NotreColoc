import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { getSession } from "@/lib/auth/session";
import { getCsrfToken } from "@/lib/csrf";
import { getRememberedInvite } from "@/lib/invitations";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(session.active_household_id ? "/accueil" : "/integrations");
  }

  const csrfToken = (await getCsrfToken()) ?? "";
  const hasInvite = Boolean(await getRememberedInvite());

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Créer ton compte</h1>
        <p className="text-sm text-muted-foreground">NotreColoc est prêt à accueillir ta maison.</p>
      </div>
      <RegisterForm csrfToken={csrfToken} hasInvite={hasInvite} />
    </div>
  );
}
