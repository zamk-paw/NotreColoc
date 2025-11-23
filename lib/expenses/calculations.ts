export type Expense = {
    id: string;
    amount: number;
    currency: string;
    payer_id: string;
    participants: {
        user_id: string;
        share: number;
    }[];
};

export type Balance = {
    user_id: string;
    amount: number;
    currency: string;
};

export type Reimbursement = {
    from: string;
    to: string;
    amount: number;
    currency: string;
};

export function calculateBalances(expenses: Expense[], userIds: string[]): Balance[] {
    const balances: Record<string, number> = {};
    const currency = expenses[0]?.currency || "EUR"; // Simplified

    // Initialize balances
    userIds.forEach(id => balances[id] = 0);

    expenses.forEach(expense => {
        // Payer paid the full amount, so they are "owed" this amount initially
        balances[expense.payer_id] = (balances[expense.payer_id] || 0) + expense.amount;

        // Each participant "owes" their share
        expense.participants.forEach(p => {
            balances[p.user_id] = (balances[p.user_id] || 0) - p.share;
        });
    });

    return Object.entries(balances).map(([user_id, amount]) => ({
        user_id,
        amount,
        currency
    }));
}

export function calculateReimbursements(balances: Balance[]): Reimbursement[] {
    const reimbursements: Reimbursement[] = [];
    const currency = balances[0]?.currency || "EUR";

    // Separate debtors (negative balance) and creditors (positive balance)
    let debtors = balances.filter(b => b.amount < -0.01).sort((a, b) => a.amount - b.amount); // Ascending (most negative first)
    let creditors = balances.filter(b => b.amount > 0.01).sort((a, b) => b.amount - a.amount); // Descending (most positive first)

    // Greedy algorithm to match debtors to creditors
    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of what the debtor owes and what the creditor is owed
        const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

        if (amount > 0.01) {
            reimbursements.push({
                from: debtor.user_id,
                to: creditor.user_id,
                amount,
                currency
            });
        }

        // Update balances
        debtor.amount += amount;
        creditor.amount -= amount;

        // Move indices if settled
        if (Math.abs(debtor.amount) < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return reimbursements;
}
