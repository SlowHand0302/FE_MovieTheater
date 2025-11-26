export interface CreateTransactionResponse {
    transactionId: string;
    paymentIntentId: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    providerMeta: string;
    paymentUrl: string;
    createdAt: string;
}
