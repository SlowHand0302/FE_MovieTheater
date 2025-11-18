import { Auditable } from '@/interfaces/Auditable.interface';
import { MovieGenre } from '@/interfaces/MovieGenre.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { MOVIE_GENRES_ENDPOINT } from './constants';

// Create movie genre mutation
export const useCreateMovieGenre = () => {
    return useMutation({
        mutationFn: async (data: Omit<MovieGenre, keyof Auditable>) => {
            return await apiClient.post<ApiResponse<MovieGenre>>(MOVIE_GENRES_ENDPOINT, data);
        },
    });
};

// Update single movie genre mutation
export const useUpdateMovieGenre = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Omit<MovieGenre, keyof Auditable> }) => {
            return await apiClient.put<ApiResponse<MovieGenre>>(`${MOVIE_GENRES_ENDPOINT}/${id}`, data);
        },
    });
};

// Delete single movie genre mutation
export const useDeleteMovieGenre = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.put<ApiResponse<null>>(`${MOVIE_GENRES_ENDPOINT}/${id}`);
        },
    });
};
