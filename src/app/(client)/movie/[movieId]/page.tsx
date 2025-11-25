'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ShowtimeSelector from './components/ShowTimeSelector';
import { Play, Calendar, Clock, Globe, MapPin, Share2, Heart, Users, Info } from 'lucide-react';

import { useMovieById } from '@/features/movie/queries';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';
import { useTrailer } from '@/providers/TrailerContext.provider';

export default function MovieDetailPage() {
    const dynamicParams = useParams();
    const movieId = dynamicParams.movieId;
    const { openTrailer } = useTrailer();
    const { data, isError, isLoading, error } = useMovieById(movieId?.toString());
    const movie = data as MovieBaseResultData;

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden -mx-5 px-4">
                <div>
                    <div
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                            backgroundImage: `url(data:image/jpeg;base64,${movie.poster})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/100 to-background/40" />
                </div>
                <div className="relative px-4 mt-[12vh] flex md:items-start items-center justify-start md:gap-6 gap-0 md:flex-row flex-col">
                    <div>
                        <div className="group relative" onClick={() => openTrailer(movie.trailerUrl as string)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`data:image/jpeg;base64,${movie.poster}`}
                                alt={movie.name}
                                className="aspect-auto md:w-90 w-56 rounded-xl object-cover animate-in fade-in slide-in-from-left-4 duration-1000 block"
                            />

                            <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button className="gap-2 rounded-full border size-30 bg-transparent cursor-pointer hover:bg-none flex items-center justify-center">
                                    <Play className="size-10" fill="white" strokeWidth={0} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4 space-y-3">
                            <Button variant="outline" className="gap-2">
                                <Heart className={`w-4 h-4 fill-red-500 text-red-500`} />
                                Favorite
                            </Button>
                            <Button variant="outline" className="gap-2">
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        </div>
                    </div>

                    <div className="flex-[60%] flex flex-col justify-center lg:items-start items-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <h1 className="text-5xl lg:text-start text-center font-bold text-shadow-lg">{movie.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge className="flex items-center gap-2 rounded-sm">
                                <Clock className="w-4 h-4" />
                                <span>{movie.duration}</span>
                            </Badge>
                            <Badge className="flex items-center gap-2 rounded-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{movie.releaseDate.toString()}</span>
                            </Badge>
                        </div>
                        <div className="gap-2 flex-wrap lg:justify-start justify-center flex">
                            {movie.genres?.map((genre) => (
                                <Badge key={genre.genreId} variant="secondary" className="text-xs rounded-sm">
                                    {genre.genreName}
                                </Badge>
                            ))}
                        </div>

                        <p className="text-sm text-shadow-lg lg:text-start text-center">{movie.description}</p>

                        <Separator />

                        <div className="w-full flex gap-6 lg:flex-row flex-col">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Details
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Director</h3>
                                            <p className="font-medium">
                                                {movie.persons
                                                    .filter((person) => person.role.toLowerCase() === 'director')
                                                    .map((director) => director.fullName)}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                                Publisher
                                            </h3>
                                            <p className="font-medium">{movie.publisher}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Language</h3>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-muted-foreground" />
                                                <p className="font-medium">{movie.language}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <p className="font-medium">{movie.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Cast & Crew
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {movie.persons.map((person) => (
                                        <div key={person.personId} className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                <Users className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="capitalize">
                                                <p className="font-medium">{person.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{person.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ShowtimeSelector />
        </div>
    );
}
