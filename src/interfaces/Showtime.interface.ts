import { Auditable } from './Auditable.interface';
import { Room } from './Room.interface';
import { ShowTimeSeat } from './ShowTimeSeat.interface';

export enum ShowTimeStatus {
    SCHEDULED = 'scheduled',
    OPEN = 'open',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export interface ShowTime extends Auditable {
    roomId: string;
    startTime: Date;
    endTime: Date;
    status: string;
    room: Room;
    showTimeSeats: ShowTimeSeat[];
}
