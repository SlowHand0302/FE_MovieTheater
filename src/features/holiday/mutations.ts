import { Auditable } from '@/interfaces/Auditable.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useMutation } from '@tanstack/react-query';
import { HOLIDAY_ENDPOINT } from './constants';
import { GetHolidaysDto } from './DTOs/GetHolidays.dto';

// Create room type mutation
export const useCreateHoliday = () => {
    return useMutation({
        mutationFn: async (data: Omit<GetHolidaysDto, 'id'>) => {
            return await apiClient.post<ApiResponse<GetHolidaysDto>>(`${HOLIDAY_ENDPOINT}s`, data);
        },
    });
};

// Update single room type mutation
export const useUpdateHoliday = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Omit<GetHolidaysDto, keyof Auditable> }) => {
            return await apiClient.put<ApiResponse<GetHolidaysDto>>(`${HOLIDAY_ENDPOINT}s/${id}`, data);
        },
    });
};
