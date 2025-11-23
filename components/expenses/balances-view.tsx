"use client";

import { useMemo } from "react";
import { calculateBalances, calculateReimbursements, type Expense } from "@/lib/expenses/calculations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Member = {
    id: string;
    name: string;
    email: string;
};

type Props = {
    expenses: Expense[];
    members: Member[];
};

export function BalancesView({ expenses, members }: Props) {
    const { balances, reimbursements } = useMemo(() => {
        const userIds = members.map((m) => m.id);
        const balances = calculateBalances(expenses, userIds);
        const reimbursements = calculateReimbursements(balances);
        return { balances, reimbursements };
    }, [expenses, members]);

    const getMemberName = (id: string) => {
        const member = members.find((m) => m.id === id);
        return member ? (member.name ?? member.email) : "Inconnu";
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Soldes</CardTitle>
                        <CardDescription>Situation nette de chaque colocataire.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {balances.map((balance) => (
                            <div
                                key={balance.user_id}
                                className="flex items-center justify-between rounded-xl border border-border/50 p-3"
                            >
                                <span className="font-medium">{getMemberName(balance.user_id)}</span>
                                <Badge
                                    variant={balance.amount > 0 ? "default" : balance.amount < 0 ? "destructive" : "secondary"}
                                    className={cn(
                                        "ml-auto",
                                        balance.amount > 0 && "bg-emerald-600 hover:bg-emerald-700",
                                        balance.amount === 0 && "bg-muted text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {balance.amount > 0 ? "+" : ""}
                                    {balance.amount.toFixed(2)} {balance.currency}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Remboursements suggérés</CardTitle>
                        <CardDescription>Pour équilibrer les comptes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {reimbursements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                                <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
                                <p>Les comptes sont équilibrés !</p>
                            </div>
                        ) : (
                            reimbursements.map((r, i) => (
                                <div key={i} className="flex items-center justify-between rounded-xl bg-muted/30 p-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-destructive">{getMemberName(r.from)}</span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-emerald-600">{getMemberName(r.to)}</span>
                                    </div>
                                    <span className="font-bold">
                                        {r.amount.toFixed(2)} {r.currency}
                                    </span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
