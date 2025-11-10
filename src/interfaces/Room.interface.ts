import { Auditable } from './Auditable.interface';

export enum RoomStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    MAINTENANCE = 'maintenance',
    CLOSED = 'closed',
}

export interface Room extends Auditable {
    roomNumber: number;
    status: RoomStatus;
    cinemaId: string;
    roomTypeId: string;
    total_Column: number;
    total_Row: number;
}
