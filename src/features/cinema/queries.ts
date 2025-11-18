import { apiClient } from '@/lib/apiClient';
import { CINEMA_ENDPOINT } from './constants';
import { useQuery } from '@tanstack/react-query';
import { Cinema } from '@/interfaces/Cinema.interface';
import { ApiResponse } from '@/types/ApiResponse.type';

interface CinemaQueryStrings {
    Id?: string;
    City?: string;
    Name?: string;
    Status?: string;
}
// Query cinemas by query string
export const useCinemas = (queryString: CinemaQueryStrings) => {
    return useQuery({
        queryKey: ['cinemas', queryString],
        queryFn: async () => {
            return apiClient.get<ApiResponse<Cinema[]>>(`${CINEMA_ENDPOINT}s?${JSON.stringify(queryString)}`);
        },
        enabled: !!queryString,
    });
};
