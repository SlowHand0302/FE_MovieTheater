import { Auditable } from '@/interfaces/Auditable.interface';
import { User } from '@/interfaces/User.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { USER_STAFF_ENDPOINT } from '../constants';

export const useCreateStaff = () => {
    return useMutation({
        mutationFn: async (
            data:
                | Omit<User, 'isVerified' | 'point' | keyof Auditable>
                | { cinemaId: string; position: string; salary: number },
        ) => {
            return apiClient.post<ApiResponse<{ userId: string }>>(`${USER_STAFF_ENDPOINT}`, data);
        },
    });
};
