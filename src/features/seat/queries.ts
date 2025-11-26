import { Seat } from '@/interfaces/Seat.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { SEAT_ENDPOINT } from './constant';

// Query seats by room
export const useSeatsByRoom = (roomId: string) => {
    return useQuery({
        queryKey: ['seats', roomId],
        queryFn: async () => {
            return await apiClient.get<ApiResponse<Seat[]>>(`${SEAT_ENDPOINT}s/${roomId}}`);
        },
    });
};
