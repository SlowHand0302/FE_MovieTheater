import { ShowTimeStatus } from '@/interfaces/Showtime.interface';

export interface ShowTimeByMovieResult {
    cinemaId: string;
    cinemaName: string;
    address: string;
    roomTypes: RoomTypeResult[];
}

export interface ShowTimeByCinemaResult {
    movieId: string;
    movieName: string;
    poster: string;
    roomTypes: RoomTypeResult[];
}

export interface RoomTypeResult {
    roomTypeId: string;
    roomTypeName: string;
    showtimes: ShowTimeDetailResult[];
}

export interface ShowTimeDetailResult {
    showtimeId: string;
    startTime: string;
    endTime: string;
}

export interface ShowTimeByRoomResult {
    movieId: string;
    movieName: string;
    showtimeId: string;
    startTime: Date;
    endTime: Date;
    status: ShowTimeStatus;
}

export interface ShowtimeDetailResult {
    cinemaId: string;
    cinemaName: string;
    city: string;
    roomId: string;
    roomNumber: number;
    totalColumn: number;
    totalRow: number;
    roomType: string;
    startTime: string;
    endTime: string;
    movieId: string;
    movieName: string;
    poster: string;
}
