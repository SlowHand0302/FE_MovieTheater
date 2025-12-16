'use client';
import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cinema } from '@/interfaces/Cinema.interface';
import { useShowTimeByCinema } from '@/features/show-time/queries';
import { ShowTimeByCinemaResult } from '@/features/show-time/DTOs/GetShowTimes.dto';

interface ShowTimeListByCinemaProps {
    selectedDate: string;
    selectedCinema: Cinema | null;
}

export default function ShowTimeListByCinema({ selectedCinema, selectedDate }: ShowTimeListByCinemaProps) {
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
