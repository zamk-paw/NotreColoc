import { redirect } from "next/navigation";
import { getSession, setActiveHousehold } from "@/lib/auth/session";
import { acceptInvite } from "@/lib/invitations";
import { getInviteToken } from "@/lib/invite-cookie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ t?: string }>;
};

export default async function InvitePage(props: Props) {
  const searchParams = await props.searchParams;
  const token = searchParams.t ?? (await getInviteToken()) ?? undefined;
  const session = await getSession();

  if (token && session) {
    try {
      const householdId = await acceptInvite({ token, userId: session.user_id });
      await setActiveHousehold(householdId);
      redirect("/accueil");
    } catch (error) {
      console.error(error);
    }
  }

  if (session?.active_household_id) {
    redirect("/accueil");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Invitation NotreColoc</CardTitle>
          <CardDescription>
            {token
              ? "Invitation détectée. Connecte-toi pour la finaliser."
              : "Entre un code d’invitation depuis ton tableau de bord ou connecte-toi."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" asChild>
            <a href={session ? "/integrations" : "/login"}>{session ? "Terminer l’onboarding" : "Se connecter"}</a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="/register">Créer un compte</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
