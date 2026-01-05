import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { GetHolidaysDto } from './DTOs/GetHolidays.dto';
import { HOLIDAY_ENDPOINT } from './constants';

interface HolidayQueryStrings {
    Name?: string;
    StartDate?: string;
    EndDate?: string;
}
// Query all movie genres
export const useHolidays = (queryString: Partial<Record<keyof HolidayQueryStrings, string>>) => {
    const params = new URLSearchParams(queryString).toString();

    return useQuery({
        queryKey: ['holidays', params],
        queryFn: async () => {
            return await apiClient.get<ApiResponse<GetHolidaysDto[]>>(
                `${HOLIDAY_ENDPOINT}s?${params ? `?${params}` : ''}`,
            );
        },
        select: (d) => d.data,
    });
};
