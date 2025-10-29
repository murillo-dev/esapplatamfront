export interface Transaction {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    date: Date;
    status: 'completed' | 'failed' | 'pending';
    description?: string;
    currency: string;
    reference?: string;
}


export type TransactionStatus = Transaction['status'];