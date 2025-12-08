import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jwtDecode, type JwtPayload, type JwtHeader } from 'jwt-decode';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function decodeJWT(token: string) {
    if (!token) {
        return null;
    }

    try {
        const header = jwtDecode<JwtHeader>(token, { header: true });
        const payload = jwtDecode<JwtPayload>(token);
        return { header, payload };
    } catch (error) {
        console.log(error);
        return { header: null, payload: null };
    }
}

export function isJwtExpired(token: string) {
    if (!token) {
        return true;
    }
    try {
        const payload = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (!payload.exp) return false;

        return payload.exp && payload.exp <= currentTime;
    } catch (error) {
        console.log(error);
        return true;
    }
}
