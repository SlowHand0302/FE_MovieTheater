import { MovieGenre } from '@/interfaces/MovieGenre.interface';
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/ApiResponse.type';
import { useQuery } from '@tanstack/react-query';
import { MOVIE_GENRES_ENDPOINT } from './constants';

interface MovieGenreQueryStrings {
    Id?: string;
    Name?: string;
}
// Query all movie genres
export const useMovieGenres = (queryString: MovieGenreQueryStrings) => {
    return useQuery({
        queryKey: ['genres', queryString],
        queryFn: async () => {
            return await apiClient.get<ApiResponse<MovieGenre[]>>(
                `${MOVIE_GENRES_ENDPOINT}s?${JSON.stringify(queryString)}`,
            );
        },
    });
};
