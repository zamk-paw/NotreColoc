import { getCsrfToken } from "@/lib/csrf";
import { updatePasswordAction } from "@/app/(app)/actions/account";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SecurityPage() {
  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>Mets à jour tes identifiants régulièrement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updatePasswordAction} className="space-y-4">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <div className="space-y-2">
              <Label htmlFor="current_password">Mot de passe actuel</Label>
              <Input id="current_password" type="password" name="current_password" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                <Input id="new_password" type="password" name="new_password" minLength={8} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirmation</Label>
                <Input id="confirm_password" type="password" name="confirm_password" minLength={8} required />
              </div>
            </div>
            <Button type="submit">Mettre à jour</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Authentification à deux facteurs</CardTitle>
          <CardDescription>Placeholder en attendant la prochaine version.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Active bientôt l’A2F et les clés de sécurité pour protéger davantage ton compte.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sessions & appareils</CardTitle>
          <CardDescription>Historique des connexions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Cette section affichera les sessions connectées.</p>
        </CardContent>
      </Card>
    </div>
  );
}
