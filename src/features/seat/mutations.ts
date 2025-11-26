import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { RoomType } from '@/interfaces/RoomType.interface';
import { SEAT_ENDPOINT } from './constant';

interface PatchSeatParams {
    ids: string[];
    isActive: true;
    seatTypeId: string;
}
// Patch updated seat mutation
export const usePatchSeat = () => {
    return useMutation({
        mutationFn: async ({ data }: { data: PatchSeatParams }) => {
            return await apiClient.patch<ApiResponse<RoomType>>(`${SEAT_ENDPOINT}s`, data);
        },
    });
};
