import { Auditable } from '@/interfaces/Auditable.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { ROOM_TYPE_ENDPOINT } from './constants';
import { RoomType } from '@/interfaces/RoomType.interface';

// Create room type mutation
export const useCreateRoomType = () => {
    return useMutation({
        mutationFn: async (data: Omit<RoomType, keyof Auditable>) => {
            return await apiClient.post<ApiResponse<RoomType>>(ROOM_TYPE_ENDPOINT, data);
        },
    });
};

// Update single room type mutation
export const useUpdateRoomType = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Omit<RoomType, keyof Auditable> }) => {
            return await apiClient.put<ApiResponse<RoomType>>(`${ROOM_TYPE_ENDPOINT}/${id}`, data);
        },
    });
};

// Delete single room type mutation
export const useDeleteRoomType = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.put<ApiResponse<null>>(`${ROOM_TYPE_ENDPOINT}/${id}`);
        },
    });
};
