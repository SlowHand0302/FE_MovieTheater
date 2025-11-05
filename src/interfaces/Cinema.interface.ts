import { Auditable } from './Auditable.interface';

export enum CinemaStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    MAINTENANCE = 'maintenance',
    CLOSED = 'closed',
}

export interface Cinema extends Auditable {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    status: CinemaStatus;
    open_Time: string;
    close_Time: string;
    city: string;
}
