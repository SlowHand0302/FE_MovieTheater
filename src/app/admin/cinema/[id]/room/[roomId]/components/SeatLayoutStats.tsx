import { Seat } from '@/interfaces/Seat.interface';
import { SeatType } from '@/interfaces/SeatType.interface';
import React from 'react';

interface SeatLayoutStatsProps {
    seats: Seat[];
    seatTypes: SeatType[];
}

const SeatLayoutStats = ({ seats, seatTypes }: SeatLayoutStatsProps) => {
    return (
        <div className="space-y-1 pt-4 border-t border-slate-700 text-sm">
            <div className="flex justify-between">
                <span>Total Seats:</span>
                <span className="">{seats.length}</span>
            </div>
            <div className="flex justify-between">
                <span>Active:</span>
                <span className="">{seats.filter((s) => s.isActive).length}</span>
            </div>
            {seatTypes.map((type) => {
                return (
                    <div key={type.id} className="flex justify-between">
                        <span className="capitalize">{type.type}: </span>
                        <span className="">{seats.filter((s) => s.seatType === type.type).length}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SeatLayoutStats;
