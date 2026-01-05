import { Staff } from '@/interfaces/User.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { USER_STAFF_ENDPOINT } from '../constants';

export const useCreateStaff = () => {
    return useMutation({
        mutationFn: async (data: Omit<Staff, 'id'>) => {
            return apiClient.post<ApiResponse<{ userId: string }>>(`${USER_STAFF_ENDPOINT}`, data);
        },
    });
};

export const useUpdateStaff = () => {
    return useMutation({
        mutationFn: async ({ staffId, data }: { staffId: string; data: Omit<Staff, 'id'> }) => {
            return apiClient.put<ApiResponse<null>>(`${USER_STAFF_ENDPOINT}s/${staffId}`, data);
        },
    });
};
