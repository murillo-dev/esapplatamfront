export interface TransactionFilter {
    fromAccount?: string;
    toAccount?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: Date;
    endDate?: Date;
    status?: 'completed' | 'failed' | 'pending';

}

export interface TransactionFilterOptions {
    accounts: string[]; // Lista de IDs de cuentas para filtros
    minAmount: number;
    maxAmount: number;
    dateRange: {
        start: Date;
        end: Date;
    };
}