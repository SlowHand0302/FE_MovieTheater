import { Auditable } from './Auditable.interface';

export interface User extends Auditable {
    fullName: string;
    email: string;
    password: string;
    role: string;
    phoneNumber: string;
    dayOfBirth: Date;
    gender: string;
    points: number;
    address: string;
    isVerified: boolean;
}
