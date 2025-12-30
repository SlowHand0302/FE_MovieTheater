export enum SeatStatus {
    AVAILABLE = 'available',
    BOOKED = 'booked',
    RESERVED = 'reserved',
}

export interface Seat {
    id: string;
    label: string;
    columnIndex: number;
    displayNumber: number;
    seatCode: string;
    isActive: boolean;
    status: SeatStatus;
    seatType: string;
    roomId: string;
}
