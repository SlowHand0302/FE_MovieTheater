'use client';

import * as React from 'react';
import { CalendarDays } from 'lucide-react';

import { TimePicker } from './TimePicker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
    selectedDate: Date;
    setSelectedDate: (date: Date | undefined) => void;
    withTimePicker?: boolean;
}

export default function DatePicker({ selectedDate, setSelectedDate, withTimePicker = false }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                    {withTimePicker && selectedDate
                        ? selectedDate.toLocaleString()
                        : selectedDate
                          ? selectedDate.toLocaleDateString()
                          : 'Select Date'}
                    <CalendarDays />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Card className="py-4 gap-0">
                    <CardContent className="px-0">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                setSelectedDate(date);
                                setOpen(false);
                            }}
                        />
                    </CardContent>
                    {withTimePicker && (
                        <CardFooter className="flex justify-center items-center border-t px-4 !pt-4 *:[div]:w-full">
                            <TimePicker date={selectedDate} setDate={setSelectedDate} />
                        </CardFooter>
                    )}
                </Card>
            </PopoverContent>
        </Popover>
    );
}
