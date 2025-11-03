import { Auditable } from './Auditable.interface';

export interface SeatType extends Auditable {
    type: string;
    extraPrice: number;
}
