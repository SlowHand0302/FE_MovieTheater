import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { USER_CUSTOMER_ENDPOINT } from '../constants';
import User from '@/interfaces/User.interface';

export const useCreateCustomer = () => {
    return useMutation({
        mutationFn: async (data: Pick<User, 'email' | 'password' | 'fullName'>) => {
            return await apiClient.post<ApiResponse<{ userId: string }>>(`${USER_CUSTOMER_ENDPOINT}`, data);
        },
    });
};
