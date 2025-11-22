import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import MovieCard from '../../components/MovieCard';

import { Movie } from '@/interfaces/Movie.interface';
import { Auditable } from '@/interfaces/Auditable.interface';
interface FeaturedSectionProps {
    title: string;
    movies: Omit<Movie, keyof Auditable>[];
}

const FeaturedSection = ({ title, movies }: FeaturedSectionProps) => {
    return (
        <section className="my-5">
            <header className="mb-0 flex justify-between items-center">
                <h1 className="font-bold text-4xl">{title}</h1>
                <div className="space-x-2 md:overflow-x-auto overflow-x-scroll hideScrollbar">
                    <Link href={'/movie'} passHref>
                        <Button variant={'outline'}>See More</Button>
                    </Link>
                </div>
            </header>
            <div className="overflow-x-auto scrollbar-hidden">
                <div className="flex gap-4 py-4 min-w-max">
                    {movies.map((movie, index) => (
                        <div key={index} className="w-60 flex-none">
                            <Link href={'/movie/:id'} passHref>
                                <MovieCard movie={movie} style={{ animationDelay: `${index * 100}ms` }} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
