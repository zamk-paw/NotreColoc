import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/session";
import { getCsrfToken } from "@/lib/csrf";
import { getInviteToken } from "@/lib/invite-cookie";
import { Badge } from "@/components/ui/badge";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(session.active_household_id ? "/accueil" : "/integrations");
  }

  const csrfToken = (await getCsrfToken()) ?? "";
  const hasInvite = Boolean(await getInviteToken());

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <Badge variant="secondary" className="mb-2">
          Tableau de bord NotreColoc
        </Badge>
        <h1 className="text-2xl font-semibold">Connexion</h1>
        <p className="text-sm text-muted-foreground">
          Continue à piloter ta colocation. Nouveau membre ?{" "}
          <Link href="/register" className="text-emerald-600 hover:underline">
            Crée un compte
          </Link>
        </p>
        {hasInvite ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Une invitation est prête à être acceptée après connexion.
          </p>
        ) : null}
      </header>
      <LoginForm csrfToken={csrfToken} />
    </div>
  );
}
