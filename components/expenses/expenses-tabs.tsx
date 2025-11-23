"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpensesList } from "./expenses-list";
import { BalancesView } from "./balances-view";
import { Button } from "@/components/ui/button";
import { ExpenseModal } from "./expense-modal";
import { FileText, Plus, Receipt, PieChart } from "lucide-react";

type Props = {
    expenses: any[]; // Typed in children
    members: any[]; // Typed in children
    csrfToken: string;
};

export function ExpensesTabs({ expenses, members, csrfToken }: Props) {
    const [activeTab, setActiveTab] = useState("list");

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                        <TabsTrigger value="list">Dépenses</TabsTrigger>
                        <TabsTrigger value="balances">Équilibre</TabsTrigger>
                        <TabsTrigger value="analysis">Analyse</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    <ExpenseModal
                        members={members.map((m) => ({
                            id: m.id,
                            name: m.name ?? m.email,
                        }))}
                        csrfToken={csrfToken}
                    />
                </div>
            </div>

            <Tabs value={activeTab} className="space-y-6">
                <TabsContent value="list" className="space-y-6">
                    <ExpensesList expenses={expenses} />
                </TabsContent>

                <TabsContent value="balances">
                    <BalancesView expenses={expenses} members={members} />
                </TabsContent>

                <TabsContent value="analysis">
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-20 text-center">
                        <div className="mb-4 rounded-full bg-muted p-4">
                            <PieChart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">Analyse des dépenses</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mt-2">
                            Bientôt disponible : visualisez la répartition des dépenses par catégorie et par personne.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
