import { User } from '@/interfaces/User.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { USER_CUSTOMER_ENDPOINT } from '../constants';

export const useCustomerProfile = (userId?: string) => {
    return useQuery({
        queryKey: ['customer', userId],
        queryFn: () => apiClient.get<ApiResponse<User>>(`${USER_CUSTOMER_ENDPOINT}s?userId=${userId}`),
        enabled: !!userId,
        select: (d) => (Array.isArray(d.data) ? d.data[0] : d.data),
    });
};
