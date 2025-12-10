'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Clock, EllipsisVertical, Play } from 'lucide-react';

import { useMovieList } from '@/features/movie/queries';
import { useTrailer } from '@/providers/TrailerContext.provider';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';

const HeroBanner = () => {
    const router = useRouter();
    const { openTrailer } = useTrailer();
    const { data = [], isLoading, isError, error } = useMovieList({});
    const movies = data as MovieBaseResultData[];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    // const prevSlide = () => {
    //     setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    // };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-play with pause on hover
    useEffect(() => {
        if (!isAutoPlaying) return;

        timeoutRef.current = setInterval(() => {
            nextSlide();
        }, 6000); // Change every 6 seconds

        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        };
    }, [currentIndex, isAutoPlaying, nextSlide]);

    const currentMovie = movies[currentIndex];

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <section
            className="relative h-screen min-h-screen overflow-hidden -mx-5 px-4"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Image with smooth transition */}
            <div className="absolute inset-0">
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                            opacity: index === currentIndex ? 1 : 0,
                            backgroundImage: `url(${movie.poster})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/40" />
            </div>

            <div className="relative container px-4 h-full mx-auto flex items-center justify-center lg:justify-start gap-3 pb-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`${currentMovie.poster}`}
                    alt={currentMovie.name}
                    className="aspect-auto h-95 rounded-xl object-cover animate-in fade-in slide-in-from-left-4 duration-1000 hidden lg:block"
                />
                <div className="max-w-[80vw] animate-in flex flex-col justify-center lg:items-start items-center space-y-4 fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="line-clamp-2 text-3xl sm:text-5xl md:text-7xl sm:leading-16 md:leading-26 lg:text-start text-center font-bold text-shadow-lg text-white">
                        {currentMovie.name}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge className="flex items-center gap-2 rounded-sm">
                            <Clock className="w-4 h-4" />
                            <span>{currentMovie.duration}</span>
                        </Badge>
                        <Badge className="flex items-center gap-2 rounded-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{currentMovie.releaseDate.toString()}</span>
                        </Badge>
                    </div>
                    <div className="gap-2 flex-wrap lg:justify-start justify-center lg:flex hidden">
                        {currentMovie.genres.map((genre) => (
                            <Badge key={genre.genreId} variant="secondary" className="text-xs rounded-sm">
                                {genre.genreName}
                            </Badge>
                        ))}
                    </div>

                    <div className="hidden sm:block">
                        <p className="line-clamp-3 text-lg text-shadow-lg text-white lg:text-start text-center">
                            {currentMovie.description}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            size="lg"
                            className="group"
                            onClick={() => openTrailer(currentMovie.trailerUrl as string)}
                        >
                            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Watch Trailer
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => router.push(`/movie/${currentMovie.id}`)}>
                            Book Tickets
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="hidden sm:block"
                            onClick={() => router.push(`/movie/${currentMovie.id}`)}
                        >
                            <EllipsisVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-20 md:right-10 right-1/2 md:translate-x-0 translate-x-1/2 flex gap-3">
                {movies.map((movie, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer ${
                            index === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`${movie.poster}`}
                            alt={movie.name}
                            className="h-[60px] aspect-video object-cover rounded-md"
                        />
                        {/* {index === currentIndex && <div className="absolute inset-0 bg-white/30" />} */}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default HeroBanner;
