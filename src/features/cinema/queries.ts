import { apiClient } from '@/lib/apiClient';
import { CINEMA_ENDPOINT } from './constants';
import { useQuery } from '@tanstack/react-query';
import { Cinema } from '@/interfaces/Cinema.interface';
import { ApiResponse } from '@/types/ApiResponse.type';
import { Auditable } from '@/interfaces/Auditable.interface';

interface CinemaQueryStrings {
    Id?: string;
    City?: string;
    Name?: string;
    Status?: string;
}
// Query cinemas by query string
export const useCinemas = (queryString: Omit<CinemaQueryStrings, 'Id'>) => {
    const params = new URLSearchParams(queryString).toString();

    return useQuery({
        queryKey: ['cinemas', queryString],
        queryFn: async () => {
            return apiClient.get<ApiResponse<Cinema[]>>(`${CINEMA_ENDPOINT}s?${params ? params : ''}`);
        },
        enabled: !!queryString,
        select: (d) => d.data,
    });
};

export const useCinema = (cinemaId?: string) => {
    return useQuery({
        queryKey: ['cinema', cinemaId],
        queryFn: () => apiClient.get<ApiResponse<Omit<Cinema, keyof Auditable>>>(`${CINEMA_ENDPOINT}s?Id=${cinemaId}`),
        enabled: !!cinemaId,
        select: (d) => (Array.isArray(d.data) ? d.data[0] : d.data),
    });
};
