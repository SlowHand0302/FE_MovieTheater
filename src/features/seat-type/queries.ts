import { SeatType } from '@/interfaces/SeatType.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { SEAT_TYPE_ENDPOINT } from './constants';

interface SeatTypeQueryStrings {
    Id?: string;
    Name?: string;
}
// Query all movie genres
export const useSeatTypes = (queryString: SeatTypeQueryStrings) => {
    return useQuery({
        queryKey: ['genres', queryString],
        queryFn: async () => {
            return await apiClient.get<ApiResponse<SeatType[]>>(
                `${SEAT_TYPE_ENDPOINT}s?${JSON.stringify(queryString)}`,
            );
        },
    });
};
