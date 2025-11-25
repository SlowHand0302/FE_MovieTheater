'use client';

import HeroBanner from './components/HeroBanner';
import FeaturedSection from './components/FeaturedSection';
import { EventSection } from './components/EventSection';
import { useMovieList } from '@/features/movie/queries';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';

export default function Home() {
    const { data = [], isLoading, isError, error } = useMovieList({});

    const movies = data as MovieBaseResultData[];

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <>
            <HeroBanner />
            <FeaturedSection title="Now Showing" movies={movies} />
            <FeaturedSection title="Coming Soon" movies={movies} />
            <EventSection />
        </>
    );
}
