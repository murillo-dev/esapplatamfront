import { computed, signal, Injectable } from "@angular/core";
import { Account, Transaction, TransactionFilter } from "../models";
import { FilterStore } from "./filter";

@Injectable({
    providedIn: 'root'
})
export class TransactionStore {
    private _accounts = signal<Account[]>([]);
    private _transactions = signal<Transaction[]>([]);

    public filterStore = new FilterStore();

    public accounts = this._accounts.asReadonly();
    public transaction = this._transactions.asReadonly();

    public filteredTransactions = computed(() => {
        const transactions = this._transactions();
        const filter = this.filterStore.filter();

        return transactions.filter(transaction => {
            return this.applyFilters(transaction, filter);
        });
    });

    public filteredDashboardData = computed(() => {
        const transactions = this.filteredTransactions();
        return this.calculateDashboardData(transactions);
    });

    public dashboardData = computed(() => {
        const transactions = this._transactions();
        return this.calculateDashboardData(transactions);
    });

    public filterOptions = computed(() => {
        const transactions = this._transactions();
        const accounts = this._accounts();

        const accountIds = Array.from(new Set([
            ...transactions.map(t => t.fromAccount),
            ...transactions.map(t => t.toAccount)
        ]));

        const amounts = transactions.map(t => t.amount);
        const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;
        const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;

        const dates = transactions.map(t => t.date);
        const startDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
        const endDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();

        return {
            accountIds,
            accounts: accounts.filter(acc => accountIds.includes(acc.id)),
            minAmount,
            maxAmount,
            dateRange: { start: startDate, end: endDate }
        };
    });

    // Actions
    public setAccounts(accounts: Account[]) {
        this._accounts.set([...accounts]);
    }

    public addTransaction(transaction: Transaction) {
        this._transactions.update(transactions => [...transactions, transaction]);
    }

    public updateAccounts(id: string, amount: number) {
        const accounts = this._accounts();
        const updatedAccounts = accounts.map(acc => {
            if (acc.id === id) {
                return { ...acc, balance: acc.balance + amount };
            }
            return acc;
        });
        this._accounts.set(updatedAccounts);
    }


    private applyFilters(transaction: Transaction, filter: TransactionFilter): boolean {
        // Filtro por cuenta origen
        if (filter.fromAccount && transaction.fromAccount !== filter.fromAccount) {
            return false;
        }

        // Filtro por cuenta destino
        if (filter.toAccount && transaction.toAccount !== filter.toAccount) {
            return false;
        }

        // Filtro por monto mínimo
        if (filter.minAmount && transaction.amount < filter.minAmount) {
            return false;
        }

        // Filtro por monto máximo
        if (filter.maxAmount && transaction.amount > filter.maxAmount) {
            return false;
        }

        // Filtro por fecha inicio
        if (filter.startDate && transaction.date < filter.startDate) {
            return false;
        }

        // Filtro por fecha fin
        if (filter.endDate && transaction.date > filter.endDate) {
            return false;
        }

        // Filtro por estado
        if (filter.status && transaction.status !== filter.status) {
            return false;
        }

        return true;
    }

    private calculateDashboardData(transactions: Transaction[]) {
        const totalTransactions = transactions.length;
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

        // Estadísticas por cuenta
        const accountStats = new Map<string, { outgoing: number; incoming: number; total: number }>();

        transactions.forEach(t => {
            // Cuenta origen (outgoing)
            const fromStats = accountStats.get(t.fromAccount) || { outgoing: 0, incoming: 0, total: 0 };
            fromStats.outgoing += t.amount;
            fromStats.total += 1;
            accountStats.set(t.fromAccount, fromStats);

            // Cuenta destino (incoming)
            const toStats = accountStats.get(t.toAccount) || { outgoing: 0, incoming: 0, total: 0 };
            toStats.incoming += t.amount;
            toStats.total += 1;
            accountStats.set(t.toAccount, toStats);
        });

        // Encontrar cuenta más activa
        let mostActiveAccount = { accountId: '', count: 0, amount: 0 };
        accountStats.forEach((stats, accountId) => {
            if (stats.total > mostActiveAccount.count) {
                mostActiveAccount = { accountId, count: stats.total, amount: stats.outgoing + stats.incoming };
            }
        });

        return {
            totalTransactions,
            totalAmount,
            averageAmount: totalTransactions > 0 ? totalAmount / totalTransactions : 0,
            mostActiveAccount: mostActiveAccount.accountId ? mostActiveAccount : null,
            accountStats: Object.fromEntries(accountStats)
        };
    }
}