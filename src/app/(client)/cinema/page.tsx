'use client';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCinemas } from '@/features/cinema/queries';
import { Cinema } from '@/interfaces/Cinema.interface';
import { useShowTimeByCinema } from '@/features/show-time/queries';
import { ShowTimeByCinemaResult } from '@/features/show-time/DTOs/GetShowTimes.dto';
import DateSelectorCarousel from '../components/DateSelectorCarousel';

export default function CinemaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const dateFromUrl = searchParams.get('date');

    const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
    const [selectedDate, setSelectedDate] = React.useState(dateFromUrl ?? new Date().toLocaleDateString());

    useEffect(() => {
        setSelectedDate(dateFromUrl ?? new Date().toLocaleDateString());
    }, [selectedCinema]);

    useEffect(() => {
        if (!selectedCinema) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('cinemaId', selectedCinema.id);
        params.set('date', selectedDate);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [selectedCinema, selectedDate]);

    return (
        <section className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-20">
            <Card className="flex items-start md:items-center justify-between gap-4 md:flex-row flex-col md:py-6 py-2 mt-2 mb-6">
                <CardContent className="flex-1 md:px-6 px-2">
                    {selectedCinema && (
                        <>
                            <h1 className="text-[22px] font-bold">{selectedCinema.name}</h1>
                            <p className="text-sm md:mt-5">
                                <span className="text-grey-40">Address: </span>
                                {selectedCinema.address}
                            </p>
                            <p className="space-x-2">
                                <span className="text-sm">
                                    <span className="text-grey-40">Hotline: </span>
                                    <a className="text-blue-10 transition-all duration-300" href="tel:1900 2224">
                                        {selectedCinema.phoneNumber}
                                    </a>
                                </span>
                                <span>-</span>
                                <span className="text-sm">
                                    <span className="text-grey-40">Email: </span>
                                    <a className="text-blue-10 transition-all duration-300" href="tel:1900 2224">
                                        {selectedCinema.email}
                                    </a>
                                </span>
                            </p>
                        </>
                    )}
                </CardContent>

                {/* Filters */}
                <CinemaFilter onSelectCinema={setSelectedCinema} />
            </Card>

            {selectedCinema ? (
                <div className="space-y-6">
                    <DateSelectorCarousel value={selectedDate} onValueChange={setSelectedDate} />
                    <ShowTimeListByCinema selectedCinema={selectedCinema} selectedDate={selectedDate} />
                </div>
            ) : (
                <div className="h-24 flex items-center justify-center">
                    Please select your desired region and cinema.
                </div>
            )}
        </section>
    );
}

function ShowTimeListByCinema({
    selectedCinema,
    selectedDate,
}: {
    selectedCinema: Cinema | null;
    selectedDate: string;
}) {
    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useShowTimeByCinema({
        cinemaId: selectedCinema?.id,
        Date: selectedDate,
    });
    const showTimes = data as ShowTimeByCinemaResult[];
    console.log(showTimes);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return showTimes.length > 0 ? (
        showTimes.map((cinema) => {
            return (
                <Card key={cinema.movieId} className="flex-row">
                    <CardContent className="px-0 pl-3">
                        <img
                            src={`${cinema.poster}`}
                            alt={cinema.movieName}
                            className="lg:w-40 w-30 aspect-auto rounded-2xl"
                        />
                    </CardContent>
                    <div className="w-full">
                        <CardHeader className="px-4 pl-0">
                            <CardTitle className="text-xl font-semibold text-gray-900">{cinema.movieName}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pl-0 md:space-y-8 space-y-4">
                            {cinema.roomTypes.map((type) => {
                                return (
                                    <div
                                        key={type.roomTypeId}
                                        className="flex items-start lg:gap-20 gap-3 lg:flex-row flex-col"
                                    >
                                        <CardTitle className="text-sm text-gray-500">{type.roomTypeName}</CardTitle>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {type.showtimes.map((time) => (
                                                <Link href={`/booking/${time.showtimeId}`} key={time.showtimeId}>
                                                    <Button
                                                        variant="outline"
                                                        size="lg"
                                                        className="text-sm font-medium cursor-pointer hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all"
                                                    >
                                                        {new Date(time.startTime).toLocaleTimeString('vi-VN', {
                                                            hourCycle: 'h24',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </div>
                </Card>
            );
        })
    ) : (
        <div className="text-center py-10 text-gray-600">No show times available for this date.</div>
    );
}

interface CinemaFilterProps {
    onSelectCinema: (cinema: Cinema) => void;
}
function CinemaFilter({ onSelectCinema }: CinemaFilterProps) {
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
