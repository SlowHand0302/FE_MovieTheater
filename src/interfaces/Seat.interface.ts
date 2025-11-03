import { Auditable } from './Auditable.interface';

export interface Seat extends Auditable {
    label: string;
    columnIndex: number;
    displayNumber: number;
    seatCode: string;
    isActive: boolean;
    status: string;
    seatTypeId: string;
    roomId: string;
}
