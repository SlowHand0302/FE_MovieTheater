import { Auditable } from './Auditable.interface';

export interface RoomType extends Auditable {
    type: string;
    basePrice: number;
}
