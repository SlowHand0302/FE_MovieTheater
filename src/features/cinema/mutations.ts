import { Auditable } from '@/interfaces/Auditable.interface';
import { Cinema } from '@/interfaces/Cinema.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { CINEMA_ENDPOINT } from './constants';

// Create Cinema mutation
export const useCreateCinema = () => {
    return useMutation({
        mutationFn: async (data: Omit<Cinema, keyof Auditable>) => {
            return await apiClient.post<ApiResponse<Cinema>>(CINEMA_ENDPOINT, data);
        },
    });
};

// Update Single Cinema mutation
export const useUpdateCinema = () => {
    return useMutation({
        mutationFn: async ({ data, id }: { data: Omit<Cinema, keyof Auditable>; id: string }) => {
            return await apiClient.put<ApiResponse<Cinema>>(`${CINEMA_ENDPOINT}/${id}`, data);
        },
    });
};

// Delete Single Cinema mutation
export const useDeleteCinema = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete<ApiResponse<null>>(`${CINEMA_ENDPOINT}/${id}`);
        },
    });
};
