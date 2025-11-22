import { Receipt, Filter, Download, Plus } from "lucide-react";
import { requireActiveHousehold } from "@/lib/auth/session";
import { db } from "@/db";
import { ExpenseModal } from "@/components/expenses/expense-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const demoExpenses = [
  { label: "Courses bio", amount: 64.8, payer: "Camille", date: "Aujourd’hui", participants: 3 },
  { label: "Internet fibre", amount: 39.99, payer: "Léo", date: "Hier", participants: 4 },
];

export default async function ExpensesPage() {
  const session = await requireActiveHousehold();
  const members = await db.membership.findMany({
    where: { household_id: session.active_household_id! },
    include: {
      user: true,
    },
    orderBy: { created_at: "asc" },
  });

  const balances = members.map((member, index) => ({
    id: member.user.id,
    name: member.user.name ?? member.user.email,
    amount: Number(((index - 1) * 18.5).toFixed(2)),
  }));

  const globalBalance = balances.reduce((acc, balance) => acc + balance.amount, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Finances</p>
          <h1 className="text-2xl font-semibold">Dépenses partagées</h1>
          <p className="text-sm text-muted-foreground">Suivi simplifié des remboursements.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExpenseModal
            members={members.map((m) => ({
              id: m.user.id,
              name: m.user.name ?? m.user.email,
            }))}
          />
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-emerald-50/50 dark:bg-emerald-500/10">
          <CardHeader>
            <CardTitle>Solde global</CardTitle>
            <CardDescription>Somme des soldes individuels</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{globalBalance.toFixed(2)} €</p>
          </CardContent>
        </Card>
        {balances.map((balance) => (
          <Card key={balance.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{balance.name}</CardTitle>
              <Badge variant={balance.amount >= 0 ? "default" : "destructive"}>
                {balance.amount >= 0 ? "À recevoir" : "À rembourser"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-semibold", balance.amount >= 0 ? "text-emerald-600" : "text-red-500")}>
                {balance.amount >= 0 ? "+" : ""}
                {balance.amount.toFixed(2)} €
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Dépenses</CardTitle>
            <CardDescription>Historique et simulation (placeholder)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoExpenses.map((expense) => (
              <div key={expense.label} className="rounded-2xl border border-border/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{expense.label}</p>
                    <p className="text-xs text-muted-foreground">{expense.date}</p>
                  </div>
                  <p className="text-lg font-semibold">{expense.amount.toFixed(2)} €</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Payé par {expense.payer} • {expense.participants} participants
                </p>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-border/70 p-4 text-center text-sm text-muted-foreground">
              Aucune dépense réelle pour le moment. Active ce module pour commencer.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Équilibrer la colocation</CardTitle>
            <CardDescription>Prévisualisation des transactions suggérées.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              NotreColoc recommandera bientôt des remboursements automatiques basés sur les soldes calculés.
            </p>
            <Button variant="outline" className="w-full">
              <Receipt className="mr-2 h-4 w-4" />
              Exporter les transactions
            </Button>
          </CardContent>
        </Card>
      </section>
      <Button
        size="icon"
        className="fixed bottom-20 right-5 h-14 w-14 rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 lg:hidden"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
