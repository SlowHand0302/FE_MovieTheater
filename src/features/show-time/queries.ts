import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { SHOW_TIME_ENDPOINT, SHOW_TIME_SEAT_ENDPOINT } from './constants';
import { ShowTimeSeat } from '@/interfaces/ShowTimeSeat.interface';
import { ShowTimeResult } from './DTOs/GetShowTimes.dto';
import { ShowTimeSeatResult } from './DTOs/GetShowTimeSeat.dto';

interface ShowTimeQueryString {
    Date: string;
    Country: string;
    [key: string]: string;
}

// Query show time by movie
export const useShowTimesByMovie = ({
    movieId,
    queryString,
}: {
    movieId: string;
    queryString: ShowTimeQueryString;
}) => {
    return useQuery({
        queryKey: ['showtimes', movieId, queryString],
        queryFn: async () => {
            const params = new URLSearchParams(queryString).toString();
            return await apiClient.get<ApiResponse<ShowTimeResult[]>>(`${SHOW_TIME_ENDPOINT}s/${movieId}?${params}`);
        },
        select: (d) => d.data,
        enabled: !!movieId,
    });
};

// Query show time seat by show time
export const useShowTimeSeatByShowTime = (showTimeId: string) => {
    return useQuery({
        queryKey: ['showtime-seats', showTimeId],
        queryFn: async () => {
            return await apiClient.get<ApiResponse<ShowTimeSeatResult[]>>(`${SHOW_TIME_SEAT_ENDPOINT}s/${showTimeId}`);
        },
        select: (d) => d.data,
        enabled: !!showTimeId,
    });
};
