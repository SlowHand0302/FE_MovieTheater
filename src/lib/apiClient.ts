import { ApiError } from '@/types/ApiError.type';
import { useAuthStore } from '@/features/auth/useAuthStore';

interface RetryableRequestInit extends RequestInit {
    _isRetry?: boolean;
}
class ApiClient {
    private baseUrl: string;
    private refreshing: Promise<string | null> | null = null;

    constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
        this.baseUrl = baseUrl;
    }

    private getAccessToken(): string | null {
        return useAuthStore.getState().accessToken;
    }

    public async refreshAccessToken(): Promise<string | null> {
        try {
            const refreshRes = await fetch(`${this.baseUrl}/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!refreshRes.ok) {
                throw new Error('Refresh token invalid');
            }

            const data = await refreshRes.json();
            const { accessToken } = data.data;
            console.log(accessToken);

            // Update tokens in store (automatically saves to localStorage)
            useAuthStore.getState().setTokens(accessToken, '');

            return accessToken;
        } catch (error) {
            // Refresh failed - logout and redirect
            useAuthStore.getState().logout();
            console.log(error);
            return null;
        }
    }

    private async request<T>(endpoint: string, options: RetryableRequestInit = {}): Promise<T> {
        const accessToken = this.getAccessToken();
        const url = `${this.baseUrl}${endpoint}`;

        const headers = new Headers(options.headers);
        // Only set Content-Type for JSON if body is not FormData
        if (!(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        let res = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
            mode: 'cors',
            cache: 'no-cache',
        });

        // Handle 401 - try to refresh token once
        if (res.status === 401 && !options._isRetry) {
            if (!this.refreshing) {
                this.refreshing = this.refreshAccessToken().finally(() => {
                    this.refreshing = null;
                });
                const newAccessToken = await this.refreshing;

                if (!newAccessToken) {
                    throw new ApiError('Unauthenticated', 401);
                }

                headers.set('Authorization', `Bearer ${newAccessToken}`);

                res = await fetch(url, {
                    ...options,
                    headers,
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'no-cache',
                });
            }
        }

        let json: ApiError;
        try {
            json = await res.json();
        } catch {
            throw new ApiError('Invalid JSON response from server', 500);
        }

        console.log(json);

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

    patch<T>(endpoint: string, data?: unknown, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    delete<T>(endpoint: string, options?: RequestInit) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    postWithFile<T>(endpoint: string, formData: FormData, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: formData,
        });
    }

    putWithFile<T>(endpoint: string, formData: FormData, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: formData,
        });
    }

    patchWithFile<T>(endpoint: string, formData: FormData, options?: RequestInit) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: formData,
        });
    }
}

export const apiClient = new ApiClient();
