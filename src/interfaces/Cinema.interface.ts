import { Auditable } from './Auditable.interface';

export interface Cinema extends Auditable {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    status: string;
    open_Time: string;
    close_Time: string;
    city: string;
}
