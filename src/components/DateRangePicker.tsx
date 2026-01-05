'use client';

import * as React from 'react';
import { CalendarDays, CalendarIcon } from 'lucide-react';

import { TimePicker } from './TimePicker';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRangePickerProps {
    selectedDateRange?: DateRange;
    setSelectedDateRange?: (date: DateRange | undefined) => void;
}

export default function DateRangePicker({ selectedDateRange, setSelectedDateRange }: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [range, setRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <CalendarIcon />
                    {range?.from && range?.to
                        ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                        : 'Pick a date range'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                <Calendar
                    className="w-full"
                    mode="range"
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={setRange}
                    disableNavigation
                    startMonth={range?.from}
                    fixedWeeks
                    showOutsideDays
                />
            </PopoverContent>
        </Popover>
    );
}
