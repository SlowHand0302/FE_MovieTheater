import { User } from '@/interfaces/User.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';

export const useUserProfile = (enabled: boolean) => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => apiClient.get<ApiResponse<User>>(`/profile`),
        select: (d) => (Array.isArray(d.data) ? d.data[0] : d.data),
        enabled: !!enabled,
    });
};
