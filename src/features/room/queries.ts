import { apiClient } from '@/lib/apiClient';
import { ROOM_ENDPOINT } from './constants';
import { useQuery } from '@tanstack/react-query';
import { Room } from '@/interfaces/Room.interface';
import { ApiResponse } from '@/types/ApiResponse.type';

interface RoomQueryStrings {
    Id?: string;
    RoomNumber?: string;
    Type?: string;
    Status?: string;
}
// Query Rooms by query string
export const useRooms = ({ cinemaId, queryString }: { cinemaId: string; queryString: RoomQueryStrings }) => {
    return useQuery({
        queryKey: ['rooms', cinemaId, queryString],
        queryFn: async () => {
            return apiClient.get<ApiResponse<Room[]>>(`${ROOM_ENDPOINT}s/${cinemaId}?${JSON.stringify(queryString)}`);
        },
        enabled: !!queryString,
    });
};
