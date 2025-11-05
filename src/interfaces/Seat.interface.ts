import { Auditable } from './Auditable.interface';

export enum SeatStatus {
    AVAILABLE = 'available',
    BOOKED = 'booked',
    RESERVED = 'reserved',
}

export interface Seat extends Auditable {
    label: string;
    columnIndex: number;
    displayNumber: number;
    seatCode: string;
    isActive: boolean;
    status: SeatStatus;
    seatTypeId: string;
    roomId: string;
}
