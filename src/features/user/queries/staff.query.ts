import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { USER_STAFF_ENDPOINT } from '../constants';
import { Staff } from '@/interfaces/User.interface';

export const useStaffProfile = (queryString: { staffId?: string; cinemaId?: string }) => {
    const params = new URLSearchParams(queryString).toString();
    return useQuery({
        queryKey: ['staff', queryString.staffId, queryString.cinemaId],
        queryFn: () =>
            apiClient.get<ApiResponse<Staff & { userId: string }>>(`${USER_STAFF_ENDPOINT}s?${params ? params : ''}`),
        enabled: !!queryString.staffId && !!queryString.cinemaId,
        select: (d) => (Array.isArray(d.data) ? d.data[0] : d.data),
    });
};

export const useStaffProfiles = (cinemaId?: string) => {
    const params = new URLSearchParams(cinemaId).toString();
    return useQuery({
        queryKey: ['staffs', cinemaId],
        queryFn: () =>
            apiClient.get<ApiResponse<(Staff & { userId: string })[]>>(
                `${USER_STAFF_ENDPOINT}s?${params ? params : ''}`,
            ),
        select: (d) => d.data,
    });
};
