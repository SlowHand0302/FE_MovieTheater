import { RoomType } from '@/interfaces/RoomType.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { ROOM_TYPE_ENDPOINT } from './constants';

interface RoomTypeQueryStrings {
    Id?: string;
    Type?: string;
    BasePrice?: string;
}
// Query all movie genres
export const useRoomTypes = (queryString: Partial<Record<keyof RoomTypeQueryStrings, string>>) => {
    const params = new URLSearchParams(queryString).toString();

    return useQuery({
        queryKey: ['room-types', params],
        queryFn: async () => {
            return await apiClient.get<ApiResponse<RoomType[]>>(`${ROOM_TYPE_ENDPOINT}s?${params ? `?${params}` : ''}`);
        },
        select: (d) => d.data,
    });
};
