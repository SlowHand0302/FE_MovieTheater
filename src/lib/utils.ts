import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jwtDecode } from 'jwt-decode';
import { CustomJwt } from '@/types/CustomJwt.type';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function decodeJWT(token: string) {
    try {
        const payload = jwtDecode<CustomJwt>(token);

        return {
            id: payload.sub,
            email: payload['email'],
            role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        };
    } catch (error) {
        console.log(error);
        return { header: null, payload: null };
    }
}

export function isJwtExpired(token: string) {
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

export function convertToFormData<T extends Record<string, unknown>>(
    data: T,
    formData = new FormData(),
    parentKey = '',
): FormData {
    Object.entries(data).forEach(([key, value]) => {
        const formKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value === null || value === undefined) return;

        if (value instanceof File) {
            formData.append(formKey, value);
        } else if (value instanceof Date) {
            // adjust date string base on backend
            formData.append(formKey, value.toDateString());
        } else if (Array.isArray(value)) {
            if (value.every((item) => item instanceof Blob)) {
                value.forEach((file) => formData.append(formKey, file));
            } else {
                // Recurse into array elements with indexed keys
                value.forEach((item, index) => {
                    const arrayKey = `${formKey}[${index}]`;
                    if (item instanceof Blob) {
                        formData.append(arrayKey, item);
                    } else if (typeof item === 'object' || Array.isArray(item)) {
                        convertToFormData(item as Record<string, unknown>, formData, arrayKey); // Note: Type cast might need adjustment for arrays
                    } else {
                        formData.append(arrayKey, String(item));
                    }
                });
            }
        } else if (typeof value === 'object') {
            // Recursive for nested objects (optional)
            convertToFormData(value as Record<string, unknown>, formData, formKey);
            // Or just stringify:
            // formData.append(formKey, JSON.stringify(value));
        } else {
            formData.append(formKey, String(value));
        }
    });

    return formData;
}
