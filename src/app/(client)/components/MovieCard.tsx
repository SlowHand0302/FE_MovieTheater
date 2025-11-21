import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Auditable } from '@/interfaces/Auditable.interface';
import { Movie } from '@/interfaces/Movie.interface';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import React from 'react';

interface MovieCardProps {
    movie: Omit<Movie, keyof Auditable>;
}

const MovieCard = ({ movie }: MovieCardProps) => {
    return (
        <Card
            className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${0 * 100}ms` }}
        >
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={movie.poster}
                    alt={movie.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Button size="sm" className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Trailer
                        </Button>
                        <Button size="sm" variant="secondary" className="w-full">
                            Book Now
                        </Button>
                    </div>
                </div>

                {movie.status === 'coming_soon' && <Badge className="absolute top-3 right-3">Coming Soon</Badge>}

                {/* {movie.rating > 0 && (
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-semibold">{movie.rating}</span>
                    </div>
                )} */}
            </div>

            <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.name}
                </h3>

                <div className="flex flex-wrap gap-1">
                    {movie.genres.map((genre) => (
                        <Badge key={genre.id} variant="outline" className="text-xs">
                            {genre.name}
                        </Badge>
                    ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>

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
    );
};

export default MovieCard;
