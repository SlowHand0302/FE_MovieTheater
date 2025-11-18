import { ApiError } from '@/types/ApiError.type';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = this.getToken();
        const url = `${this.baseUrl}${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        if (token) {
            Object.assign(headers, { Authorization: `Bearer ${token}` });
        }

        const res = await fetch(url, {
            ...options,
            headers,
            // credentials: 'include',
            mode: 'cors',
            cache: 'no-cache',
        });

        let json: ApiError;
        try {
            json = await res.json();
        } catch {
            throw new ApiError('Invalid JSON response from server', 500);
        }

        // Handle microservice-level errors even if HTTP is 200
        if (!json.result || json.statusCode >= 400 || res.status >= 400) {
            throw new ApiError(json.message || `HTTP ${res.status} - Request failed`, json.statusCode || res.status);
        }

        return json as T;
    }

    get<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, data?: unknown, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    put<T>(endpoint: string, data?: unknown, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    delete<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();
