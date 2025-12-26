import { Auditable } from './Auditable.interface';
import { MovieGenre } from './MovieGenre.interface';
import { MoviePerson } from './MoviePerson.interface';

export enum MovieStatus {
    COMING_SOON = 'coming_soon',
    SHOWING = 'showing',
    STOPPED = 'stopped',
}

export interface Movie extends Auditable {
    name: string;
    description: string;
    releaseDate: Date;
    duration: string;
    publisher: string;
    country: string;
    language: string;
    poster: string;
    trailerUrl: string;
    genres: MovieGenre[];
    persons: MoviePerson[];
    status: MovieStatus;
}
