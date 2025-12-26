import { Room } from '@/interfaces/Room.interface';
import { Seat, SeatStatus } from '@/interfaces/Seat.interface';

export const generateMockSeats = (room: Room): Seat[] => {
    const seats: Seat[] = [];

    Array.from({ length: room.totalRow }).forEach((_, index) => {
        for (let col = 1; col <= room.totalColumn; col++) {
            seats.push({
                label: String.fromCharCode(65 + index).toUpperCase(),
                columnIndex: col,
                displayNumber: col,
                seatCode: `${String.fromCharCode(65 + index).toUpperCase()}${col}`,
                isActive: true,
                status: SeatStatus.AVAILABLE,
                seatTypeId: col >= 4 && col <= 9 ? 'st-002' : 'st-001',
                roomId: 'room-1',
                id: `seat-${index}`,
                createdAt: new Date('2023-06-16T09:00:00Z'),
                updatedAt: new Date('2023-06-16T09:00:00Z'),
                createdBy: 'usr_001',
                updatedBy: 'usr_001',
                isDeleted: false,
            });
        }
    });

    return seats;
};
