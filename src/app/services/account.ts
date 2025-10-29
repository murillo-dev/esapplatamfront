import { inject, Injectable } from '@angular/core';
import { TransactionStore } from '../stores/transaction';
import { Account, Transaction } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private store = inject(TransactionStore);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockAccounts: Account[] = [
      {
        id: '1',
        accountNumber: '001-123456',
        type: 'checking',
        holderName: 'Juan Pérez',
        holderPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
        balance: 5000,
        currency: 'USD',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '2',
        accountNumber: '001-789012',
        type: 'savings',
        holderName: 'María García',
        holderPhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
        balance: 15000,
        currency: 'USD',
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '3',
        accountNumber: '001-345678',
        type: 'business',
        holderName: 'Carlos López',
        holderPhoto: 'https://randomuser.me/api/portraits/men/3.jpg',
        balance: 25000,
        currency: 'USD',
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.store.setAccounts(mockAccounts);
  }

  transferFunds(fromAccountId: string, toAccountId: string, amount: number): { success: boolean; error?: string } {
    const accounts = this.store.account();
    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    const toAccount = accounts.find(acc => acc.id === toAccountId);

    // Validaciones

    if (!fromAccount || !toAccount) {
      return { success: false, error: 'Cuenta no encontrada.' };
    }
    if (fromAccount.balance < amount) {
      return { success: false, error: 'Fondos insuficientes.' };
    }
    if (fromAccountId === toAccountId) {
      return { success: false, error: 'No se puede transferir a la misma cuenta.' };
    }

    const transaction: Transaction = {
      id: this.generateId(),
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      amount,
      date: new Date(),
      status: 'completed',
      currency: fromAccount.currency,
      description: `Transferencia a ${toAccount.holderName}`
    };

    this.store.addTransaction(transaction);
    return { success: true };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
