import { Movie } from '@/interfaces/Movie.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { MOVIE_ENDPOINT } from './constants';

// Create Movie mutation
export const useCreateMovie = () => {
    return useMutation({
        mutationFn: async (data: FormData) => {
            return await apiClient.postWithFile<ApiResponse<Movie>>(MOVIE_ENDPOINT, data);
        },
    });
};

// Update Single Movie mutation
export const useUpdateMovie = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
            return await apiClient.patchWithFile<ApiResponse<Movie>>(`${MOVIE_ENDPOINT}/${id}`, data);
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
