import { Auditable } from './Auditable.interface';

export interface Session extends Auditable {
    userId: string;
    isRevoked: boolean;
    expiresAt: Date;
    device: string;
    ipAddress: string;
}
