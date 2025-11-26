import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { CreateBookingResponse } from './DTOs/CreateResponse.dto';
import { BOOKING_ENDPOINT } from './constant';

interface CreateBookingPayload {
    showtimeId: string;
    showtimeSeatIds: string[];
    foodDrinkItems: { foodDrinkId: string; quantity: number }[];
}
export const useCreateBookingMutation = () => {
    return useMutation({
        mutationFn: async (data: CreateBookingPayload) => {
            console.log(data);
            return apiClient.post<ApiResponse<CreateBookingResponse>>(`${BOOKING_ENDPOINT}`, data);
        },
    });
};
