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
