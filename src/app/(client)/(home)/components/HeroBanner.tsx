'use client';
import React, { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Clock, EllipsisVertical, Play } from 'lucide-react';

import { Movie } from '@/interfaces/Movie.interface';
import { Auditable } from '@/interfaces/Auditable.interface';
import { mockMovies } from '@/features/movie/constants/dummyData.constant';

type FeaturedMovie = Omit<Movie, keyof Auditable>;

const HeroBanner = () => {
    const movies: FeaturedMovie[] = mockMovies as FeaturedMovie[];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

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
    }, [currentIndex, isAutoPlaying]);

    const currentMovie = movies[currentIndex];
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
                <img
                    src={currentMovie.poster}
                    alt={currentMovie.name}
                    className="aspect-auto h-80 rounded-xl object-cover animate-in fade-in slide-in-from-left-4 duration-1000 hidden lg:block"
                />
                <div className="max-w-[80vw] animate-in flex flex-col justify-center lg:items-start items-center h-80 space-y-4 fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-5xl md:text-7xl lg:text-start text-center font-bold text-white text-shadow-lg">
                        {currentMovie.name}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge className="flex items-center gap-2 rounded-sm">
                            <Clock className="w-4 h-4" />
                            <span>{currentMovie.duration}</span>
                        </Badge>
                        <Badge className="flex items-center gap-2 rounded-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{currentMovie.releaseDate.toLocaleDateString()}</span>
                        </Badge>
                    </div>
                    <div className="gap-2 flex-wrap lg:justify-start justify-center lg:flex hidden">
                        {currentMovie.genres.map((genre) => (
                            <Badge key={genre.id} variant="secondary" className="text-xs rounded-sm">
                                {genre.name}
                            </Badge>
                        ))}
                    </div>

                    <p className="text-lg text-white text-shadow-lg lg:text-start text-center max-w-xl line-clamp-3 mb-auto lg:block hidden">
                        {currentMovie.description}
                    </p>

                    <div className="flex gap-3">
                        <Button size="lg" className="group">
                            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Watch Trailer
                        </Button>
                        <Button size="lg" variant="outline">
                            Book Tickets
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" className="hidden sm:block">
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
                        <img
                            src={movie.poster}
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
