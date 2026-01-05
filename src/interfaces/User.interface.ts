import { Auditable } from './Auditable.interface';

export default interface User extends Auditable {
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

export type Staff = Omit<User, 'points' | 'address' | keyof Omit<Auditable, 'id'>> & {
    cinemaId: string;
    position: string;
    salary: number;
};
