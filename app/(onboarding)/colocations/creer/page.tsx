import { requireSession } from "@/lib/auth/session";
import { HouseholdWizard } from "@/components/households/household-wizard";
import { getCsrfToken } from "@/lib/csrf";

export default async function CreateHouseholdPage() {
  await requireSession();
  const csrfToken = (await getCsrfToken()) ?? "";

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase text-muted-foreground">Création</p>
        <h1 className="text-3xl font-semibold">Nouvelle colocation</h1>
        <p className="text-sm text-muted-foreground">
          Configure les fondamentaux puis invite tes colocataires. Tu pourras ajuster chaque module plus tard.
        </p>
      </header>
      <HouseholdWizard csrfToken={csrfToken} />
    </div>
  );
}
