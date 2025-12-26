import { Auditable } from './Auditable.interface';

export enum RoomStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    MAINTENANCE = 'maintenance',
}

export interface Room extends Auditable {
    roomNumber: number;
    status: RoomStatus;
    cinemaId: string;
    roomType: string;
    totalColumn: number;
    totalRow: number;
}
