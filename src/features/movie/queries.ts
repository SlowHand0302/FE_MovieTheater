import { apiClient } from '@/lib/apiClient';
import { MOVIE_ENDPOINT } from './constants';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/types/ApiResponse.type';
import { MovieBaseResultData } from './DTOs/GetMovie.dto';

interface MovieQueryStrings {
    Id?: string;
    Country?: string;
    Name?: string;
    Status?: string;
}
// hooks/useMovieList.ts
export const useMovieList = (filters: Omit<MovieQueryStrings, 'Id'> = {}) => {
    const params = new URLSearchParams(filters as Omit<MovieQueryStrings, 'Id'>).toString();
    return useQuery({
        queryKey: ['movie-list', filters],
        queryFn: () => apiClient.get<ApiResponse<MovieBaseResultData[]>>(`${MOVIE_ENDPOINT}s?${params}`),
        select: (d) => d.data,
    });
};

// hooks/useMovieById.ts
export const useMovieById = (id?: string) => {
    return useQuery({
        queryKey: ['movie', id],
        queryFn: () => apiClient.get<ApiResponse<MovieBaseResultData[]>>(`${MOVIE_ENDPOINT}s?Id=${id}`),
        enabled: !!id,
        select: (d) => d.data[0], // ← return single movie or undefined
    });
};
