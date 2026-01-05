import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { SHOW_TIME_ENDPOINT, SHOW_TIME_SEAT_ENDPOINT } from './constants';
import {
    ShowTimeByCinemaResult,
    ShowTimeByMovieResult,
    ShowTimeByRoomResult,
    ShowTimeDetailResult,
} from './DTOs/GetShowTimes.dto';
import { ShowTimeSeatResult } from './DTOs/GetShowTimeSeat.dto';
import { ShowTime } from '@/interfaces/Showtime.interface';

interface ShowTimeQueryString {
    Date: string;
    City: string;
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
            return await apiClient.get<ApiResponse<ShowTimeByMovieResult[]>>(
                `${SHOW_TIME_ENDPOINT}s/by-movie/${movieId}?${params}`,
            );
        },
        select: (d) => d.data,
        enabled: !!movieId,
    });
};

// Query show time by cinema
export const useShowTimeByCinema = ({ cinemaId, Date }: { cinemaId?: string } & Pick<ShowTimeQueryString, 'Date'>) => {
    return useQuery({
        queryKey: ['showtimes', cinemaId, Date],
        queryFn: async () => {
            const params = new URLSearchParams({ Date }).toString();
            return await apiClient.get<ApiResponse<ShowTimeByCinemaResult[]>>(
                `${SHOW_TIME_ENDPOINT}s/by-cinema/${cinemaId}?${params}`,
            );
        },
        select: (d) => d.data,
        enabled: !!cinemaId,
    });
};

// Query show time by room
export const useShowTimeByRoom = ({ roomId, From, To }: { roomId?: string; From?: string; To?: string }) => {
    return useQuery({
        queryKey: ['showtimes', roomId, From, To], // Fixed: include From & To, not Date constructor
        queryFn: async () => {
            const params = new URLSearchParams();
            if (From) params.append('From', From);
            if (To) params.append('To', To);

            return await apiClient.get<ApiResponse<ShowTimeByRoomResult[]>>(
                `${SHOW_TIME_ENDPOINT}s/${roomId}${params.toString() ? `?${params.toString()}` : ''}`,
            );
        },
        select: (d) => d.data,
        enabled: !!roomId,
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
