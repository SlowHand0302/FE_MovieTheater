'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateSelectorCarousel from './DateSelectorCarousel';

const cinemas = [
    {
        name: 'Galaxy Nguyễn Du',
        format: '2D Phụ Đề',
        times: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
    },
    {
        name: 'Galaxy Tân Bình',
        format: '2D Phụ Đề',
        times: [
            '16:15',
            '17:00',
            '17:45',
            '18:15',
            '19:00',
            '19:45',
            '20:15',
            '20:30',
            '21:00',
            '22:00',
            '22:30',
            '23:00',
        ],
    },
];

export default function ShowtimeSelector() {
    return (
        <div className="w-full mx-auto space-y-8 md:px-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <h2 className="text-4xl font-bold text-gray-900">Show Times</h2>
            </div>

            <div className="flex md:items-center items-start gap-4 md:flex-row flex-col">
                <DateSelectorCarousel />

                {/* Filters */}
                <div className="flex gap-4 w-full">
                    <Select defaultValue="all">
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn khu vực" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toàn quốc</SelectItem>
                            <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                            <SelectItem value="hn">Hà Nội</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all">
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Tất cả rạp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả rạp</SelectItem>
                            <SelectItem value="galaxy">Galaxy</SelectItem>
                            <SelectItem value="cgv">CGV</SelectItem>
                            <SelectItem value="lotte">Lotte Cinema</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Cinema List */}
            <div className="space-y-4">
                {cinemas.map((cinema) => (
                    <Card key={cinema.name}>
                        <CardHeader className="px-4">
                            <CardTitle className="text-xl font-semibold text-gray-900">{cinema.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 space-y-8">
                            <div className="flex items-start lg:gap-20 gap-3 lg:flex-row flex-col">
                                <CardTitle className="text-sm text-gray-500">{cinema.format}</CardTitle>
                                <div className="flex flex-wrap items-center gap-3">
                                    {cinema.times.map((time) => (
                                        <Button
                                            key={time}
                                            variant="outline"
                                            size="lg"
                                            className="text-sm font-medium cursor-pointer hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all"
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-start lg:gap-20 gap-3 lg:flex-row flex-col">
                                <CardTitle className="text-sm text-gray-500">{cinema.format}</CardTitle>
                                <div className="flex flex-wrap items-center gap-3">
                                    {cinema.times.map((time) => (
                                        <Button
                                            key={time}
                                            variant="outline"
                                            size="lg"
                                            className=" text-sm font-medium hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all"
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function DateSelector() {}
