import { Auditable } from './Auditable.interface';

export interface User extends Auditable {
    fullname: string;
    email: string;
    password: string;
    role: string;
    phoneNumber: string;
    dayOfBirth: Date;
    gender: string;
    point: number;
    address: string;
    isVerified: boolean;
}
