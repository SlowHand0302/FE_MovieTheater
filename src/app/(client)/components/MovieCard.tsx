import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';

import { cn } from '@/lib/utils';
import { useTrailer } from '@/providers/TrailerContext.provider';
import { Play, Clock, Calendar } from 'lucide-react';
import React, { ComponentProps } from 'react';

interface MovieCardProps extends ComponentProps<typeof Card> {
    movie: MovieBaseResultData;
    gridLayout?: boolean;
}

const MovieCard = ({ movie, className, gridLayout, ...props }: MovieCardProps) => {
    const { openTrailer } = useTrailer();

    const handleOnWatchTrailerClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        openTrailer(movie.trailerUrl as string);
    };

    return (
        <Card
            {...props}
            className={cn(
                className,
                'group h-full pt-0 gap-0 justify-between overflow-hidden border-border hover:border-primary/50 hover:shadow-xl',
            )}
        >
            <CardHeader className="relative aspect-[2/3] overflow-hidden px-0 gap-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`${movie.poster}`}
                    alt={movie.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Button
                            size="sm"
                            className="w-full cursor-pointer"
                            onClick={(event) => handleOnWatchTrailerClick(event)}
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

                {movie.status === 'coming_soon' && <Badge className="absolute top-3 right-3">Coming Soon</Badge>}
            </CardHeader>

            <CardContent
                className={cn('space-y-3 grid md:grid-rows-4 grid-rows-3 items-center', gridLayout && 'sm:px-6 px-3')}
            >
                <h3
                    className={cn(
                        'row-span-2 font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors',
                        gridLayout && 'md:text-lg text-sm md:text-start text-center',
                    )}
                >
                    {movie.name}
                </h3>

                <div className={cn(gridLayout && 'hidden md:block')}>
                    <p className={cn('text-sm text-muted-foreground line-clamp-2')}>{movie.description}</p>
                </div>
                <div
                    className={cn(
                        'flex items-center justify-between text-xs text-muted-foreground pt-2 border-t',
                        gridLayout && 'md:flex-row flex-col gap-1',
                    )}
                >
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{movie.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{movie.releaseDate.toString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MovieCard;
