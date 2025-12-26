import { type JwtPayload } from 'jwt-decode';

export interface CustomJwt extends JwtPayload {
    email?: string;
    ['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?: string;
}
