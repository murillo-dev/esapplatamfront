export interface Account {
    id: string;
    accountNumber: string;
    type: 'checking' | 'savings' | 'business';
    holderName: string;
    holderPhoto: string;
    balance: number;
    currency: string;
    createdAt: Date;
    isActive: boolean;
}

export type AccountType = Account['type'];