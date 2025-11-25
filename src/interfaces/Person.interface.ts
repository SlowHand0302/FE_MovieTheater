import { Auditable } from './Auditable.interface';

export interface Person extends Auditable {
    fullname: string;
    birthDate: Date;
    gender: string;
    bio: number;
    imageUrl: string;
}
