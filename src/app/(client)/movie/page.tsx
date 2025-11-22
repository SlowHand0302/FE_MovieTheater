'use client';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import MovieCard from '../components/MovieCard';
import { mockMovies } from '@/features/movie/constants/dummyData.constant';

export default function MovieDetailPage() {
    const [activeTab, setActiveTab] = useState('showing');
    const filteredMovies = mockMovies.filter((movie) => activeTab === 'all' || movie.status === activeTab);

    return (
        <section className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-20">
            <div>
                <div className="flex gap-1 py-2">
                    {[
                        { id: 'showing', label: 'Now Showing' },
                        { id: 'coming_soon', label: 'Coming Soon' },
                        { id: 'all', label: 'All Movies' },
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
                <div className="overflow-x-auto scrollbar-hidden">
                    <div className="flex gap-4 py-4 min-w-max">
                        {filteredMovies.map((movie, index) => (
                            <div key={index} className="w-60 flex-none">
                                <Link href={`/movie/${movie.name}`} passHref>
                                    <MovieCard movie={movie} style={{ animationDelay: `${index * 100}ms` }} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
