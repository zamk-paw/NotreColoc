import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Props = {
    expenses: {
        id: string;
        amount: number;
        currency: string;
        label: string;
        date: Date;
        note: string | null;
        payer: { name: string | null; email: string };
        participants: { user: { name: string | null; email: string } }[];
    }[];
};

export function ExpensesList({ expenses }: Props) {
    if (expenses.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
                Commence par ajouter une dépense pour voir apparaître la liste et les résumés.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {expenses.map((expense) => (
                <div key={expense.id} className="rounded-2xl border border-border/70 p-4 bg-card">
                    <div className="flex flex-wrap items-center justify-between">
                        <div>
                            <p className="font-medium">{expense.label}</p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
                            </p>
                        </div>
                        <p className="text-lg font-semibold">
                            {expense.amount.toFixed(2)} {expense.currency}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Payé par <span className="font-medium text-foreground">{expense.payer.name ?? expense.payer.email}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Pour : {expense.participants.map((p) => p.user.name ?? p.user.email).join(", ")}
                    </p>
                    {expense.note ? (
                        <div className="mt-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground italic">
                            "{expense.note}"
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
}
