'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Cinema } from '@/interfaces/Cinema.interface';
import { useCinemas } from '@/features/cinema/queries';

interface CinemaPageFilterProps {
    onSelectCinema: (cinema: Cinema) => void;
}
export default function CinemaPageFilter({ onSelectCinema }: CinemaPageFilterProps) {
    const searchParams = useSearchParams();
    const cinemaIdFromUrl = searchParams.get('cinemaId');

    const { data = [], isLoading, isError } = useCinemas({});
    const cinemas = data as Cinema[];
    const regions = useMemo(() => [...new Set(cinemas.map((cinema) => cinema.city))], [cinemas]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCinemaId, setSelectedCinemaId] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    const filteredCinemas = useMemo(() => {
        if (!selectedRegion) return cinemas;
        return cinemas.filter((cinema) => cinema.city === selectedRegion);
    }, [cinemas, selectedRegion]);

    const handleSelectCinema = (cinemaId: string) => {
        const cinema = cinemas.find((cinema) => cinema.id === cinemaId);
        if (!cinema) return;
        onSelectCinema(cinema);
    };

    // / Reset cinema when region changes (but not during initialization)
    useEffect(() => {
        if (isInitialized) {
            setSelectedCinemaId('');
        }
    }, [selectedRegion, isInitialized]);

    // Initialize from URL when cinemas are loaded
    useEffect(() => {
        if (cinemaIdFromUrl && cinemas.length > 0) {
            const cinema = cinemas.find((c) => c.id === cinemaIdFromUrl);
            if (cinema) {
                setSelectedRegion(cinema.city);
                setSelectedCinemaId(cinema.id);
                onSelectCinema(cinema);
                setIsInitialized(true);
            }
        }
    }, [cinemaIdFromUrl, cinemas.length, isInitialized]); // Only run when URL changes or cinemas load

    if (isLoading) return <div>Loading...</div>;
    if (isError) return null;

    return (
        <CardContent className="flex flex-2/12 gap-2 w-full md:px-6 px-2 md:flex-row flex-col">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="flex-1 w-full">
                    <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                    {regions.map((region, index) => {
                        return (
                            <SelectItem key={index} value={region}>
                                {region}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>

            <Select
                value={selectedCinemaId}
                onValueChange={(value) => {
                    setSelectedCinemaId(value);
                    handleSelectCinema(value);
                }}
                disabled={selectedRegion.length <= 0}
            >
                <SelectTrigger className="flex-1 w-full">
                    <SelectValue placeholder="Select a cinema" className="line-clamp-1 max-w-full" />
                </SelectTrigger>
                <SelectContent>
                    {filteredCinemas.map((cinema) => {
                        return (
                            <SelectItem key={cinema.id} value={cinema.id}>
                                {cinema.name}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </CardContent>
    );
}
