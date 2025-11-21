import React from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Play } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

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
                    <Button variant={'outline'}>See More</Button>
                </div>
            </header>
            <div className="overflow-x-auto scrollbar-hidden">
                <div className="flex gap-4 py-4 min-w-max">
                    {movies.map((movie, index) => (
                        <div key={index} className="w-60 flex-none">
                            <Link href={'/movie/:id'} passHref>
                                <Card
                                    key={index}
                                    className="group h-full pt-0 overflow-hidden border-border hover:border-primary/50 hover:shadow-xl"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardHeader className="relative aspect-[2/3] overflow-hidden px-0 gap-0">
                                        <img
                                            src={movie.poster}
                                            alt={movie.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <Button
                                                    size="sm"
                                                    className="w-full cursor-pointer"
                                                    onClick={(event) => event.preventDefault()}
                                                >
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Trailer
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="w-full cursor-pointer"
                                                    onClick={(event) => event.preventDefault()}
                                                >
                                                    Book Now
                                                </Button>
                                            </div>
                                        </div>

                                        {movie.status === 'coming_soon' && (
                                            <Badge className="absolute top-3 right-3">Coming Soon</Badge>
                                        )}
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {movie.name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {movie.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{movie.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {movie.releaseDate.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSection;
