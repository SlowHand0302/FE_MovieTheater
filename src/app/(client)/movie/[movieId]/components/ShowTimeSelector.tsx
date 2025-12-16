'use client';

import Link from 'next/link';
import * as React from 'react';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import DateSelectorCarousel from '../../../components/DateSelectorCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useShowTimesByMovie } from '@/features/show-time/queries';
import { ShowTimeByMovieResult } from '@/features/show-time/DTOs/GetShowTimes.dto';

export default function ShowTimeSelector() {
    const dynamicParams = useParams();
    const movieId = dynamicParams.movieId as string;
    const [selectedDate, setSelectedDate] = React.useState(new Date().toLocaleDateString());

    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useShowTimesByMovie({
        movieId,
        queryString: {
            City: '',
            Date: selectedDate,
        },
    });
    const showTimes = data as ShowTimeByMovieResult[];

    return (
        <div className="w-full mx-auto space-y-8 md:px-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <h2 className="text-4xl font-bold text-gray-900">Show Times</h2>
            </div>

            <div className="flex md:items-center items-start gap-4 md:flex-row flex-col">
                <DateSelectorCarousel value={selectedDate} onValueChange={setSelectedDate} />
            </div>

            {/* Show Time List */}
            <div className="space-y-4">
                {isError && <div>Error: {error.message}</div>}
                {isLoading ? (
                    <div>Loading...</div>
                ) : showTimes.length > 0 ? (
                    <ShowTimeList showTimes={showTimes} />
                ) : (
                    <div className="text-center py-10 text-gray-600">No show times available for this date.</div>
                )}
            </div>
        </div>
    );
}

function ShowTimeList({ showTimes }: { showTimes: ShowTimeByMovieResult[] }) {
    return showTimes.map((cinema) => (
        <Card key={cinema.cinemaId}>
            <CardHeader className="px-4">
                <CardTitle className="text-xl font-semibold text-gray-900">{cinema.cinemaName}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 space-y-8">
                {cinema.roomTypes.map((type) => {
                    return (
                        <div key={type.roomTypeId} className="flex items-start lg:gap-20 gap-3 lg:flex-row flex-col">
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
        </Card>
    ));
}
