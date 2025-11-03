import { Auditable } from './Auditable.interface';

export interface Room extends Auditable {
    roomNumber: number;
    status: string;
    cinemaId: string;
    roomTypeId: string;
    total_Column: number;
    total_Row: number;
}
