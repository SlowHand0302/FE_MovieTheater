// context/TrailerContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TrailerContextType {
    openTrailer: (url: string) => void;
    closeTrailer: () => void;
}

const TrailerContext = createContext<TrailerContextType | undefined>(undefined);

export function GlobalTrailerProvider({ children }: { children: ReactNode }) {
    const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

    const openTrailer = (url: string) => {
        setTrailerUrl(url);
    };

    const closeTrailer = () => {
        setTrailerUrl(null);
    };

    // Extract YouTube ID safely
    const getYouTubeId = (url: string | null): string | null => {
        if (!url) return null;
        const match = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
        return match ? match[1] : null;
    };

    const youtubeId = getYouTubeId(trailerUrl);

    return (
        <TrailerContext.Provider value={{ openTrailer, closeTrailer }}>
            {children}

            {/* Global Modal */}
            {youtubeId && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4">
                    {/* Close button */}
                    <button
                        onClick={closeTrailer}
                        className="absolute top-6 right-6 text-white hover:text-gray-300 transition z-10"
                        aria-label="Close trailer"
                    >
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89a.996.996 0 000-1.4z" />
                        </svg>
                    </button>

                    {/* Responsive iframe */}
                    <div className="relative w-full max-w-5xl aspect-video">
                        <iframe
                            className="absolute inset-0 w-full h-full rounded-lg shadow-2xl"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                            title="Movie Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Optional: Click outside to close */}
                    <div className="absolute inset-0" onClick={closeTrailer} aria-hidden="true" />
                </div>
            )}
        </TrailerContext.Provider>
    );
}

// Custom hook
export function useTrailer() {
    const context = useContext(TrailerContext);
    if (!context) {
        throw new Error('useTrailer must be used within GlobalTrailerProvider');
    }
    return context;
}
