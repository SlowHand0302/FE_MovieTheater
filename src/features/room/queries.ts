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
export const useRooms = ({
    cinemaId,
    queryString,
}: {
    cinemaId?: string;
    queryString: Partial<Record<keyof Omit<RoomQueryStrings, 'Id'>, string>>;
}) => {
    const params = new URLSearchParams(queryString).toString();

    return useQuery({
        queryKey: ['rooms', cinemaId, params],
        queryFn: async () => {
            return apiClient.get<ApiResponse<Room[]>>(`${ROOM_ENDPOINT}s/${cinemaId}${params ? `?${params}` : ''}`);
        },
        enabled: !!cinemaId,
        select: (d) => d.data,
    });
};

// Query room by room id
export const useRoom = ({ cinemaId, roomId }: { cinemaId?: string; roomId?: string }) => {
    const queryString: Partial<Record<keyof Pick<RoomQueryStrings, 'Id'>, string>> = { Id: roomId };
    const params = new URLSearchParams(queryString).toString();

    return useQuery({
        queryKey: ['room', cinemaId, roomId],
        queryFn: async () => {
            return apiClient.get<ApiResponse<Room>>(`${ROOM_ENDPOINT}s/${cinemaId}${params ? `?${params}` : ''}`);
        },
        enabled: !!cinemaId && !!roomId,
        select: (d) => (Array.isArray(d.data) ? d.data[0] : d.data),
    });
};
