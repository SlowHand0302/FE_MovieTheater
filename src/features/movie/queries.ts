import { apiClient } from '@/lib/apiClient';
import { MOVIE_ENDPOINT } from './constants';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/types/ApiResponse.type';
import { MovieBaseResultData } from './DTOs/GetMovie.dto';
import { Person } from '@/interfaces/Person.interface';

interface MovieQueryStrings {
    Id?: string;
    City?: string;
    Name?: string;
    Status?: string;
}
// hooks/useMovieList.ts
export const useMovieList = (filters: Partial<Record<keyof Omit<MovieQueryStrings, 'Id'>, string>> = {}) => {
    const params = new URLSearchParams(filters).toString();
    return useQuery({
        queryKey: ['movie-list', filters],
        queryFn: () => apiClient.get<ApiResponse<MovieBaseResultData[]>>(`${MOVIE_ENDPOINT}s?${params ? params : ''}`),
        select: (d) => d.data,
    });
};

// hooks/useMovieList.ts
export const useMoviePersons = (filters: Partial<Record<keyof Pick<MovieQueryStrings, 'Name'>, string>> = {}) => {
    const params = new URLSearchParams(filters).toString();
    return useQuery({
        queryKey: ['movie-persons', filters],
        queryFn: () => apiClient.get<ApiResponse<Person[]>>(`/persons?${params ? params : ''}`),
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
