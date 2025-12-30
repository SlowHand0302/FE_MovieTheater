import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { SEAT_ENDPOINT } from './constant';
import { Seat } from '@/interfaces/Seat.interface';

interface PatchSeatParams {
    ids: string[];
    isActive?: boolean;
    seatTypeId?: string;
}
// Patch updated seat mutation
export const usePatchSeat = () => {
    return useMutation({
        mutationFn: async ({ data }: { data: PatchSeatParams }) => {
            return await apiClient.patch<ApiResponse<Seat[]>>(`${SEAT_ENDPOINT}s`, data);
        },
    });
};
