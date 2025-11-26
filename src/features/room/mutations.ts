import { Auditable } from '@/interfaces/Auditable.interface';
import { Room } from '@/interfaces/Room.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { ROOM_ENDPOINT } from './constants';

// Create Room mutation
export const useCreateRoom = () => {
    return useMutation({
        mutationFn: async (data: Omit<Room, keyof Auditable>) => {
            return await apiClient.post<ApiResponse<Room>>(ROOM_ENDPOINT, data);
        },
    });
};

// Update Single Room mutation
export const useUpdateRoom = () => {
    return useMutation({
        mutationFn: async ({ data, id }: { data: Omit<Room, keyof Auditable>; id: string }) => {
            return await apiClient.put<ApiResponse<Room>>(`${ROOM_ENDPOINT}/${id}`, data);
        },
    });
};

// Delete Single Room mutation
export const useDeleteRoom = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.delete<ApiResponse<null>>(`${ROOM_ENDPOINT}/${id}`);
        },
    });
};
