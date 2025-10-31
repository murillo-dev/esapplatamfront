import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TransactionStore } from '../../stores/transaction';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatButtonModule, CurrencyPipe, MatTooltipModule, CommonModule, MatTableModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private store = inject(TransactionStore)

  public dashboardData = this.store.dashboardData;
  public filteredDashboardData = this.store.filteredDashboardData;
  public transactions = this.store.transactions;
  public filteredTransactions = this.store.filteredTransactions;
  public accounts = this.store.accounts;

  public mostActiveAccountInfo = computed(() => {
    const data = this.dashboardData();
    if (!data.mostActiveAccount) return null;

    const account = this.accounts().find(acc => acc.id === data.mostActiveAccount!.accountId);
    return account ? {
      ...account,
      transactionCount: data.mostActiveAccount!.count
    } : null;
  });

  public displayedColumns: string[] = ['fromAccount', 'toAccount', 'amount', 'status', 'date'];

  getAccountPhoto(accountId: string): string {
    const account = this.accounts().find(acc => acc.id === accountId);
    return account?.holderPhoto || 'https://randomuser.me/api/portraits/lego/1.jpg';
  }

  getAccountName(accountId: string): string {
    const account = this.accounts().find(acc => acc.id === accountId);
    return account?.holderName || 'Cuenta no encontrada';
  }

  getAccountNumber(accountId: string): string {
    const account = this.accounts().find(acc => acc.id === accountId);
    return account?.accountNumber || 'N/A';
  }

  getStatusClass(status: string): string {
    const classes = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusText(status: string): string {
    const texts = {
      'completed': 'Completado',
      'failed': 'Fallido',
      'pending': 'Pendiente'
    };
    return texts[status as keyof typeof texts] || status;
  }

  clearFilters(): void {
    this.store.filterStore.clearFilter();
  }
}
