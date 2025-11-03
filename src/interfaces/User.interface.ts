import { Auditable } from './Auditable.interface';

export interface User extends Auditable {
    name: string;
    email: string;
    password: string;
    role: string;
}
