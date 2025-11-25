import { Auditable } from './Auditable.interface';

export interface MoviePerson extends Auditable {
    movieId: string;
    personId: string;
    role: string;
}
