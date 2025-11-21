'use client';

import HeroBanner from './components/HeroBanner';
import { MovieStatus } from '@/interfaces/Movie.interface';
import FeaturedSection from './components/FeaturedSection';
import { mockMovies } from '@/features/movie/constants/dummyData.constant';
import { EventSection } from './components/EventSection';

export default function Home() {
    const comingSoonMovies = mockMovies.filter((movie) => movie.status === MovieStatus.COMING_SOON);
    const nowShowingMovies = mockMovies.filter((movie) => movie.status === MovieStatus.SHOWING);

    return (
        <>
            <HeroBanner />
            <FeaturedSection title="Now Showing" movies={[...nowShowingMovies, ...nowShowingMovies]} />
            <FeaturedSection title="Coming Soon" movies={[...comingSoonMovies, ...comingSoonMovies]} />
            <EventSection />
        </>
    );
}
