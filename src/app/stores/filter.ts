import { computed, signal } from "@angular/core";
import { TransactionFilter } from "../models/transaction-filter";

export class FilterStore {
    private _filter = signal<TransactionFilter>({});

    public filter = this._filter.asReadonly();

    public hasActiveFilters = computed(() => {
        const filter = this._filter();
        return !!(
            filter.fromAccount ||
            filter.toAccount ||
            filter.minAmount ||
            filter.maxAmount ||
            filter.startDate ||
            filter.endDate ||
            filter.status
        );
    });

    public activeFilterDescription = computed(() => {
        const filter = this._filter();
        const parts: string[] = [];

        if (filter.fromAccount) parts.push(`Desde: ${filter.fromAccount}`);
        if (filter.toAccount) parts.push(`Hacia: ${filter.toAccount}`);
        if (filter.minAmount) parts.push(`Mín: $${filter.minAmount}`);
        if (filter.maxAmount) parts.push(`Máx: $${filter.maxAmount}`);
        if (filter.status) parts.push(`Estado: ${this.translateStatus(filter.status)}`);
        // if (filter.status) parts.push(`Estado: ${filter.status}`);

        return parts.length > 0 ? parts.join(' | ') : 'Sin filtros';
    });

    // Actions

    setFilter(newFilter: TransactionFilter): void {
        this._filter.set(newFilter);
    }

    updateFilter(partialFilter: Partial<TransactionFilter>): void {
        this._filter.update(current => ({ ...current, ...partialFilter }));
    }

    clearFilter(): void {
        this._filter.set({});
    }

    setDateRange(startDate: Date, endDate: Date): void {
        this.updateFilter({ startDate, endDate });
    }

    setAmountRange(minAmount: number, maxAmount: number): void {
        this.updateFilter({ minAmount, maxAmount });
    }

    private translateStatus(status: string): string {
    const translations: { [key: string]: string } = {
      'completed': 'Completado',
      'failed': 'Fallido', 
      'pending': 'Pendiente'
    };
    return translations[status] || status;
  }
}