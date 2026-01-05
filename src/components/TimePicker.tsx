'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { TimePickerInput } from './ui/time-picker-input';

interface TimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="flex justify-center items-center gap-2">
            <TimePickerInput
                picker="hours"
                date={date}
                setDate={setDate}
                ref={hourRef}
                onRightFocus={() => minuteRef.current?.focus()}
            />
            <div>:</div>
            <TimePickerInput
                picker="minutes"
                date={date}
                setDate={setDate}
                ref={minuteRef}
                onLeftFocus={() => hourRef.current?.focus()}
                onRightFocus={() => secondRef.current?.focus()}
            />
            <div>:</div>
            <TimePickerInput
                picker="seconds"
                date={date}
                setDate={setDate}
                ref={secondRef}
                onLeftFocus={() => minuteRef.current?.focus()}
            />
            <div className="flex h-10 items-center">
                <Clock className="ml-2 h-4 w-4" />
            </div>
        </div>
    );
}
