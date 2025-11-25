import { Auditable } from '@/interfaces/Auditable.interface';
import { Movie } from '@/interfaces/Movie.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { MOVIE_ENDPOINT } from './constants';

// Create Movie mutation
export const useCreateMovie = () => {
    return useMutation({
        mutationFn: async (data: Omit<Movie, keyof Auditable>) => {
            return await apiClient.post<ApiResponse<Movie>>(MOVIE_ENDPOINT, data);
        },
    });
};

// Update Single Movie mutation
export const useUpdateMovie = () => {
    return useMutation({
        mutationFn: async ({ data, id }: { data: Omit<Movie, keyof Auditable>; id: string }) => {
            return await apiClient.put<ApiResponse<Movie>>(`${MOVIE_ENDPOINT}/${id}`, data);
        },
    });
};

// Delete Single Movie mutation
export const useDeleteMovie = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete<ApiResponse<null>>(`${MOVIE_ENDPOINT}/${id}`);
        },
    });
};
