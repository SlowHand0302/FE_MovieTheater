import React from 'react';

import { cn } from '@/lib/utils';

const vietnameseDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'] as const;

const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
};

const DateSelectorCarousel = ({ value, onValueChange }: { onValueChange: (date: string) => void; value: string }) => {
    const dates = React.useMemo(() => getNextDays(new Date(), 7), []);

    const selectedDateIndex = React.useMemo(() => dates.findIndex((d) => d.fullDate === value), [dates, value]);

    function getNextDays(startDate: Date, daysToAdd: number) {
        const today = new Date(startDate);
        today.setHours(0, 0, 0, 0);

        return Array.from({ length: daysToAdd }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const isToday = i === 0;
            const dayOfWeek = vietnameseDays[date.getDay()];

            return {
                date,
                label: isToday ? 'Hôm Nay' : formatDate(date),
                dayOfWeek,
                fullDate: date.toLocaleDateString().split('T')[0],
            };
        });
    }

    return (
        <div className="overflow-x-scroll scrollbar-hidden max-w-full">
            <div className="flex w-full gap-2 items-start">
                {[...dates].map((d, index) => {
                    const isSelected = index === selectedDateIndex;

                    return (
                        <button
                            key={index}
                            onClick={() => onValueChange(d.fullDate)}
                            className={cn(
                                'flex flex-col items-center px-4 py-3 rounded-lg min-w-28',
                                isSelected
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                            )}
                        >
                            <span className="text-xs font-medium">{d.dayOfWeek}</span>
                            <span className={cn('text-lg font-bold', isSelected && 'text-white')}>{d.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DateSelectorCarousel;
