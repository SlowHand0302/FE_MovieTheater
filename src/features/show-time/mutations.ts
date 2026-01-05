import { Auditable } from '@/interfaces/Auditable.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { ShowTime } from '@/interfaces/Showtime.interface';
import { SHOW_TIME_ENDPOINT } from './constants';
import { ShowTimeByRoomResult } from './DTOs/GetShowTimes.dto';

// Create show time mutation
export const useCreateShowTime = () => {
    return useMutation({
        mutationFn: async (data: Omit<ShowTimeByRoomResult, 'showtimeId' | 'movieName'>) => {
            return await apiClient.post<ApiResponse<ShowTime>>(SHOW_TIME_ENDPOINT, data);
        },
    });
};

// Update single show time mutation
export const useUpdateShowTime = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Omit<ShowTimeByRoomResult, 'showtimeId'> }) => {
            return await apiClient.put<ApiResponse<ShowTime>>(`${SHOW_TIME_ENDPOINT}/${id}`, data);
        },
    });
};

// Delete single show time mutation
export const useDeleteShowTime = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.put<ApiResponse<null>>(`${SHOW_TIME_ENDPOINT}/${id}`);
        },
    });
};
