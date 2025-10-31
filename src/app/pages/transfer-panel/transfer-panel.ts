import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AccountService } from '../../services/account';
import { TransactionStore } from '../../stores/transaction';
import { Account } from '../../models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transfer-panel',
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatSelectModule, CurrencyPipe, MatInputModule, MatButtonModule],
  templateUrl: './transfer-panel.html',
  styleUrl: './transfer-panel.scss',
})
export class TransferPanel {

  private _snackBar = inject(MatSnackBar);

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private store = inject(TransactionStore)

  // Signals
  public isSubmitting = signal<boolean>(false);
  public selectedFromAccount = signal<Account | null>(null);
  public selectedToAccount = signal<Account | null>(null);


  public accounts = this.store.accounts;
  public maxAmount = computed(() => this.selectedFromAccount()?.balance || 0);

  transferform: FormGroup;

  constructor() {
    this.transferform = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
    });

    this.transferform.get('fromAccount')?.valueChanges.subscribe(accountId => {
      const account = this.accounts().find(acc => acc.id === accountId) || null;
      this.selectedFromAccount.set(account);
      this.updateAmountValidator();
    })

    this.transferform.get('toAccount')?.valueChanges.subscribe(accountId => {
      const account = this.accounts().find(acc => acc.id === accountId) || null;
      this.selectedToAccount.set(account)
    })

  }

  private updateAmountValidator(): void {
    const max = this.maxAmount();
    const amountControl = this.transferform.get('amount');
    amountControl?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(max)
    ]);
    amountControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.transferform.valid) {
      this.isSubmitting.set(true);

      const { fromAccount, toAccount, amount } = this.transferform.value;

      const result = this.accountService.transferFunds(fromAccount, toAccount, amount);

      if (result.success) {
        this.transferform.reset();
        this.selectedFromAccount.set(null);
        this.selectedToAccount.set(null);
        this._snackBar.open('Transferencia realizada con éxito', 'Cerrar', { duration: 3000 });
      } else {
        console.error('Transfer error:', result.error);
        this._snackBar.open(`Error en la transferencia: ${result.error}`, 'Cerrar', { duration: 5000 });
      }

      this.isSubmitting.set(false);
    }
  }
}
