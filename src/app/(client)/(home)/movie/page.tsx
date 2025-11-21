'use client';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Calendar, Clock, MapPin, Star, ChevronRight } from 'lucide-react';

// Mock data based on your interfaces
const mockMovies = [
    {
        id: '1',
        name: 'Neon Dreams',
        description:
            'A cyberpunk thriller set in a dystopian future where memories can be stolen and sold on the black market.',
        releaseDate: new Date('2024-12-15'),
        duration: '142 min',
        publisher: 'Future Films',
        country: 'USA',
        language: 'English',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [
            { id: '1', name: 'Sci-Fi' },
            { id: '2', name: 'Thriller' },
        ],
        status: 'showing',
        rating: 8.5,
    },
    {
        id: '2',
        name: 'The Last Symphony',
        description:
            'An emotional journey through the life of a legendary composer as she faces her final performance.',
        releaseDate: new Date('2024-11-20'),
        duration: '128 min',
        publisher: 'Harmony Productions',
        country: 'France',
        language: 'French',
        poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [
            { id: '3', name: 'Drama' },
            { id: '4', name: 'Music' },
        ],
        status: 'showing',
        rating: 9.1,
    },
    {
        id: '3',
        name: 'Shadow Protocol',
        description:
            'When a top-secret mission goes wrong, an elite team must race against time to prevent global catastrophe.',
        releaseDate: new Date('2025-01-10'),
        duration: '156 min',
        publisher: 'Action Studios',
        country: 'USA',
        language: 'English',
        poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [
            { id: '5', name: 'Action' },
            { id: '6', name: 'Adventure' },
        ],
        status: 'coming_soon',
        rating: 0,
    },
    {
        id: '4',
        name: 'Whispers in the Dark',
        description:
            'A psychological horror that will leave you questioning what is real and what lurks in the shadows.',
        releaseDate: new Date('2024-10-31'),
        duration: '118 min',
        publisher: 'Dark Sky Films',
        country: 'UK',
        language: 'English',
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        trailerUrl: '#',
        genres: [
            { id: '7', name: 'Horror' },
            { id: '8', name: 'Mystery' },
        ],
        status: 'showing',
        rating: 7.8,
    },
];

export default function TheaterHomepage() {
    const [activeTab, setActiveTab] = useState('showing');

    const filteredMovies = mockMovies.filter((movie) => activeTab === 'all' || movie.status === activeTab);

    const featuredMovie = mockMovies[0];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section with Featured Movie */}
            <section className="relative h-[70vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${featuredMovie.poster})`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
                </div>

                <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
                    <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="flex gap-2">
                            {featuredMovie.genres.map((genre) => (
                                <Badge key={genre.id} variant="secondary" className="text-xs">
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-foreground">{featuredMovie.name}</h1>

                        <p className="text-lg text-muted-foreground max-w-xl">{featuredMovie.description}</p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{featuredMovie.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                <span>{featuredMovie.rating}/10</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{featuredMovie.releaseDate.toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button size="lg" className="group">
                                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Watch Trailer
                            </Button>
                            <Button size="lg" variant="outline">
                                Book Tickets
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Tabs */}
            <section className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <div className="container mx-auto px-4">
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
                </div>
            </section>

            {/* Movies Grid */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredMovies.map((movie, index) => (
                        <Card
                            key={movie.id}
                            className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 100}ms` }}
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

                                {movie.status === 'coming_soon' && (
                                    <Badge className="absolute top-3 right-3">Coming Soon</Badge>
                                )}

                                {movie.rating > 0 && (
                                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="text-xs font-semibold">{movie.rating}</span>
                                    </div>
                                )}
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
                    ))}
                </div>
            </section>

            {/* Theater Location Section */}
            <section className="bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Our Theater</h2>
                        <p className="text-muted-foreground">
                            Experience cinema like never before with state-of-the-art sound systems and comfortable
                            seating
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="p-6 text-center space-y-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Location</h3>
                                <p className="text-sm text-muted-foreground">
                                    123 Cinema Street, Entertainment District
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center space-y-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Hours</h3>
                                <p className="text-sm text-muted-foreground">Mon-Sun: 10:00 AM - 11:00 PM</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center space-y-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <Star className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Premium Experience</h3>
                                <p className="text-sm text-muted-foreground">
                                    Dolby Atmos, 4K Projection, Reclining Seats
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2024 CineMax Theater. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
