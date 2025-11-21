import { Movie, MovieStatus } from '@/interfaces/Movie.interface';
import { dummyMovieGenres } from '@/features/movie-genre/constants/dummyData.constant';
import { Auditable } from '@/interfaces/Auditable.interface';

export const mockMovies: Omit<Movie, keyof Auditable>[] = [
    {
        name: 'Neon Dreams',
        description:
            'A cyberpunk thriller set in a dystopian future where memories can be stolen and sold on the black market.',
        releaseDate: new Date('2024-12-15'),
        duration: '142 min',
        publisher: 'Future Films',
        country: 'USA',
        language: 'English',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [...dummyMovieGenres],
        status: MovieStatus.SHOWING,
    },
    {
        name: 'The Last Symphony',
        description:
            'An emotional journey through the life of a legendary composer as she faces her final performance.',
        releaseDate: new Date('2024-11-20'),
        duration: '128 min',
        publisher: 'Harmony Productions',
        country: 'France',
        language: 'French',
        poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [...dummyMovieGenres],
        status: MovieStatus.SHOWING,
    },
    {
        name: 'Shadow Protocol',
        description:
            'When a top-secret mission goes wrong, an elite team must race against time to prevent global catastrophe.',
        releaseDate: new Date('2025-01-10'),
        duration: '156 min',
        publisher: 'Action Studios',
        country: 'USA',
        language: 'English',
        poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [...dummyMovieGenres],
        status: MovieStatus.COMING_SOON,
    },
    {
        name: 'Whispers in the Dark',
        description:
            'A psychological horror that will leave you questioning what is real and what lurks in the shadows.',
        releaseDate: new Date('2024-10-31'),
        duration: '118 min',
        publisher: 'Dark Sky Films',
        country: 'UK',
        language: 'English',
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [...dummyMovieGenres],
        status: MovieStatus.SHOWING,
    },
];
