import { SeatType } from '@/interfaces/SeatType.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { SEAT_TYPE_ENDPOINT } from './constants';

interface SeatTypeQueryStrings {
    Id?: string;
    Name?: string;
    ExtraPrice?: number;
}
// Query all movie genres
export const useSeatTypes = (queryString: Partial<Record<keyof SeatTypeQueryStrings, string>>) => {
    const params = new URLSearchParams(queryString).toString();

    return useQuery({
        queryKey: ['seat-types', queryString],
        queryFn: async () => {
            return await apiClient.get<ApiResponse<SeatType[]>>(`${SEAT_TYPE_ENDPOINT}s?${params ? params : ''}`);
        },
        select: (d) => d.data,
    });
};
