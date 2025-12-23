import { Auditable } from '@/interfaces/Auditable.interface';
import { SeatType } from '@/interfaces/SeatType.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { SEAT_TYPE_ENDPOINT } from './constants';

// Create seat type mutation
export const useCreateSeatType = () => {
    return useMutation({
        mutationFn: async (data: Omit<SeatType, keyof Auditable>) => {
            return await apiClient.post<ApiResponse<SeatType>>(SEAT_TYPE_ENDPOINT, data);
        },
    });
};

// Update single seat type mutation
export const useUpdateSeatType = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Omit<SeatType, keyof Auditable> }) => {
            return await apiClient.put<ApiResponse<SeatType>>(`${SEAT_TYPE_ENDPOINT}/${id}`, data);
        },
    });
};

// Delete single seat type mutation
export const useDeleteSeatType = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete<ApiResponse<null>>(`${SEAT_TYPE_ENDPOINT}/${id}`);
        },
    });
};
