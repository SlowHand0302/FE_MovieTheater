import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { dummySeatTypes } from '@/features/seat-type/constants/dummyData.constant';
import { ShowTimeSeatResult } from '@/features/show-time/DTOs/GetShowTimeSeat.dto';

interface SelectSeatTabProps {
    seats: ShowTimeSeatResult[];
    selectedSeats: ShowTimeSeatResult[];
    onSeatClick: (seat: ShowTimeSeatResult) => void;
}

const SelectSeatTab = ({ seats, selectedSeats, onSeatClick }: SelectSeatTabProps) => {
    const getShowtimeSeatColor = (seat: ShowTimeSeatResult) => {
        // if (!seat.isActive) {
        //     return 'bg-gray-300 border-2 border-gray-400 opacity-50';
        // }
        if (selectedSeats.find((item) => item.seatCode === seat.seatCode)) {
            return 'bg-green-500 ring-4 ring-green-300';
        }
        if (seat.status === 'booked' || seat.status === 'pending') {
            return 'bg-gray-300 border-2 border-gray-400';
        }
        let color: string = '';
        switch (seat.seatType) {
            case 'Standard':
                color = 'bg-blue-400 hover:bg-blue-500';
                break;
            case 'Premium':
                color = 'bg-purple-400 hover:bg-purple-500';
                break;
            case 'Recliner':
                color = 'bg-yellow-400 hover:bg-yellow-500';
                break;
            case 'VIP Sofa':
                color = 'bg-pink-400 hover:bg-pink-500';
                break;
            case 'Loveseat':
                color = 'bg-orange-400 hover:bg-orange-500';
                break;
            default:
                break;
        }

        return color;
    };

    const groupedShowtimeSeats = seats.reduce(
        (acc, showtimeSeat) => {
            const label = showtimeSeat.label.substring(0, 1);
            if (!acc[label]) {
                acc[label] = {};
            }
            const columnIndex = Number.parseInt(showtimeSeat.label.split(label)[1]);
            acc[label][columnIndex] = showtimeSeat;
            return acc;
        },
        {} as Record<string, Record<number, ShowTimeSeatResult>>,
    );

    const allRowsShowTimeSeat = Array.from(
        new Set([
            ...Object.keys(groupedShowtimeSeats),
            ...Array.from({ length: 5 }, (_, i) => String.fromCharCode(65 + i)),
        ]),
    );

    const types = Array.from(new Set([...seats.map((seat) => seat.seatType)]));

    return (
        <Card className="">
            <CardContent className="md:px-6 px-3">
                {/* Screen */}
                <div className="relative mb-8">
                    <div className="h-2 bg-gradient-to-r from-transparent via-black to-transparent rounded-full mb-4" />
                    <p className="text-center text-sm">SCREEN</p>
                </div>
                {/* Seat Grid */}
                <div className="flex justify-center">
                    <div className="space-y-2 overflow-x-auto p-2 items-start flex flex-col">
                        {allRowsShowTimeSeat.map((row) => (
                            <div key={row} className="flex items-center justify-center gap-2 relative">
                                <span className="w-8 h-8 text-center leading-loose font-semibold sticky left-0 -translate-x-2 backdrop-filter backdrop-blur-lg bg-background/30">
                                    {row}
                                </span>
                                <div className="flex gap-2">
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map((col) => {
                                        const seat = groupedShowtimeSeats[row]?.[col];

                                        if (seat) {
                                            return (
                                                <Seat
                                                    key={seat.seatCode}
                                                    seat={seat}
                                                    onClick={onSeatClick}
                                                    seatColor={getShowtimeSeatColor(seat)}
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <SeatLayoutLegend types={types} />
            </CardContent>
        </Card>
    );
};

export default SelectSeatTab;

const Seat = ({
    seat,
    onClick,
    seatColor,
}: {
    seat: ShowTimeSeatResult;
    onClick: (seat: ShowTimeSeatResult) => void;
    seatColor: string;
}) => {
    return (
        <button
            onClick={() => onClick(seat)}
            className={`w-8 h-8 rounded-lg transition-all transform hover:scale-110 cursor-pointer ${seatColor}`}
            title={`${seat.showtimeSeatId} - ${seat.seatCode}`}
            disabled={seat.status === 'booked' || seat.status === 'pending'}
        >
            <span className="text-xs font-semibold ">{seat.label}</span>
        </button>
    );
};

const SeatLayoutLegend = ({ types }: { types: string[] }) => {
    return (
        <div className="flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-slate-700">
            {types.map((type) => {
                let color: string = '';
                switch (type) {
                    case 'Standard':
                        color = 'bg-blue-400 hover:bg-blue-500';
                        break;
                    case 'Premium':
                        color = 'bg-purple-400 hover:bg-purple-500';
                        break;
                    case 'Recliner':
                        color = 'bg-yellow-400 hover:bg-yellow-500';
                        break;
                    case 'VIP Sofa':
                        color = 'bg-pink-400 hover:bg-pink-500';
                        break;
                    case 'Loveseat':
                        color = 'bg-orange-400 hover:bg-orange-500';
                        break;
                    default:
                        break;
                }
                return (
                    <div key={type} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-sm ${color}`} />
                        <span className="text-sm ">{type}</span>
                    </div>
                );
            })}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-sm" />
                <span className="text-sm ">Selected</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded-sm opacity-50" />
                <span className="text-sm ">Booked / Holding</span>
            </div>
            {/* <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-dashed border-slate-600 rounded-sm" />
                <span className="text-sm ">Empty</span>
            </div> */}
        </div>
    );
};
