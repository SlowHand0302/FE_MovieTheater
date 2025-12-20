import { Auditable } from './Auditable.interface';

export enum CinemaStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    MAINTENANCE = 'Maintenance',
    CLOSED = 'Closed',
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
