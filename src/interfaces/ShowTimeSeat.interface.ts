import { Seat } from './Seat.interface';
import { Auditable } from './Auditable.interface';

export enum ShowTimeSeatStatus {
    AVAILABLE = 'available',
    BOOKED = 'booked',
    PENDING = 'pending',
}

export interface ShowTimeSeat extends Auditable {
    showTimeId: string;
    seatId: string;
    status: string;
    seat: Seat;
}
