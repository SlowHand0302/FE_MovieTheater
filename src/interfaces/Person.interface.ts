import { Auditable } from './Auditable.interface';

export interface Person extends Auditable {
    fullName: string;
    birthDate: Date;
    gender: string;
    bio: number;
    imageUrl: string;
}
