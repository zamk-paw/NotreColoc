import { FileText, Plus, Receipt } from "lucide-react";
import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { ExpensesTabs } from "@/components/expenses/expenses-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCsrfToken } from "@/lib/csrf";

export default async function ExpensesPage() {
  const session = await requireActiveHousehold();
  const [members, expenses] = await Promise.all([
    db.membership.findMany({
      where: { household_id: session.active_household_id! },
      include: { user: true },
      orderBy: { created_at: "asc" },
    }),
    db.expense.findMany({
      where: { household_id: session.active_household_id! },
      include: {
        payer: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { date: "desc" },
    }),
  ]);

  const csrfToken = (await getCsrfToken()) ?? "";
  const totalMembers = members.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Finances</p>
          <h1 className="text-2xl font-semibold">Dépenses partagées</h1>
          <p className="text-sm text-muted-foreground">
            Centralise les achats, remboursements et équilibrages pour ta colocation.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Dépenses enregistrées" value={`${expenses.length}`} description="Depuis le début" />
        <StatCard label="Membres" value={totalMembers.toString()} description="Participants connectés" />
        <StatCard label="Transactions à équilibrer" value="0" description="Arrivera bientôt" />
      </div>

      <ExpensesTabs expenses={expenses} members={members.map(m => m.user)} csrfToken={csrfToken} />
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  );
}
