'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import MovieCard from '../components/MovieCard';

import { useMovieList } from '@/features/movie/queries';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';

export default function MoviePage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const statusFromUrl = searchParams.get('status');
    const [activeTab, setActiveTab] = useState(statusFromUrl ?? 'all');
    const { data = [], isLoading, isError, error } = useMovieList(activeTab === 'all' ? {} : { Status: activeTab });

    const movies = data as MovieBaseResultData[];

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('status', activeTab);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [activeTab, searchParams, router]);

    if (isError) return <div>Error: {error.message}</div>;

    return (
        <section className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-20">
            <div className="flex md:items-center items-start justify-between lg:gap-4 lg:flex-row flex-col-reverse">
                <div className="flex-1 overflow-x-auto scrollbar-hidden max-w-full">
                    <div className="flex gap-1 py-2">
                        {[
                            { id: 'all', label: 'All Movies' },
                            { id: 'showing', label: 'Now Showing' },
                            { id: 'coming_soon', label: 'Coming Soon' },
                        ].map((tab) => (
                            <Button
                                key={tab.id}
                                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                                onClick={() => setActiveTab(tab.id)}
                                className="relative"
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 xl:py-4 max-w-screen">
                    {movies.map((movie, index) => (
                        <div key={index} className="shrink flex-none">
                            <Link href={`/movie/${movie.id}`} passHref>
                                <MovieCard movie={movie} style={{ animationDelay: `${index * 100}ms` }} gridLayout />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-600 w-full">There are no movies available.</div>
            )}
        </section>
    );
}
