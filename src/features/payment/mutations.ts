import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { CreateTransactionResponse } from './DTOs/CreateTransactionResponse.dto';
import { PAYMENT_ENDPOINT } from './constant';

interface CreateTransactionPayload {
    bookingId: string;
    paymentGateway: string;
}
export const useCreateTransactionMutation = () => {
    return useMutation({
        mutationFn: async (data: CreateTransactionPayload) => {
            return await apiClient.post<ApiResponse<CreateTransactionResponse>>(`${PAYMENT_ENDPOINT}`, data);
        },
    });
};
