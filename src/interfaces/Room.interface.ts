import { Auditable } from './Auditable.interface';

export enum RoomStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    MAINTENANCE = 'Maintenance',
}

export interface Room extends Auditable {
    roomNumber: number;
    status: RoomStatus;
    cinemaId: string;
    roomType: string;
    totalColumn: number;
    totalRow: number;
}
