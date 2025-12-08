import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { decodeJWT } from '@/lib/utils';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from './useAuthStore';
import { User } from '@/interfaces/User.interface';
import { queryClient } from '@/lib/queryClient.config';
import { ApiResponse } from '@/types/ApiResponse.type';

// Login mutation
export const useLoginMutation = () => {
    const router = useRouter();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: async (credentials: Pick<User, 'email' | 'password'>) => {
            return apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/sign-in', credentials);
        },
        onSuccess: (res) => {
            if (res.result) {
                const { accessToken, refreshToken } = res.data as { accessToken: string; refreshToken: string };
                authStore.setTokens(accessToken, refreshToken);
                queryClient.setQueryData(['auth-user'], accessToken);
                console.log(decodeJWT(accessToken));
                toast.success('Login Success', {
                    richColors: true,
                });
                router.push('/');
            }
        },
        onError: (error) => {
            authStore.logout();
            queryClient.setQueryData(['auth-user'], null);
            toast.error(error.message, {
                richColors: true,
            });
        },
    });
};

// Register mutation
export const useRegisterMutation = () => {
    const router = useRouter();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: async (data: Pick<User, 'email' | 'password' | 'fullname'>) => {
            return apiClient.post<ApiResponse<{ userId: string }>>('/register', data);
        },
        onSuccess: (res) => {
            if (res.result) {
                const { userId } = res.data as { userId: string };
                authStore.setVerifyId(userId);
                toast.success('Register Success', {
                    richColors: true,
                });
                router.push('/verify/account');
            }
        },
        onError: (error) => {
            toast.error(error.message, {
                richColors: true,
            });
        },
    });
};

// Logout mutation
export const useLogoutMutation = () => {
    const router = useRouter();
    const authStore = useAuthStore.getState();

    return useMutation({
        mutationFn: async () => {
            return await apiClient.post('/sign-out');
        },
        onSuccess: () => {
            authStore.logout();
            queryClient.clear();

            toast.success('Logout Success', {
                richColors: true,
            });
            router.push('/login');
        },
        onError: (error) => {
            toast.error(error.message, {
                richColors: true,
            });
        },
    });
};

// Verify account mutation
export const useVerifyAccount = () => {
    const router = useRouter();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: async (data: { userId: string; code: string }) => {
            return await apiClient.post<ApiResponse<null>>('/verify-account', data);
        },
        onSuccess: () => {
            toast.success('Verify Success', {
                richColors: true,
            });
            router.push('/login');
            const timeout = setTimeout(() => authStore.setVerifyId(null), 0);
            clearTimeout(timeout);
        },
        onError: (error) => {
            toast.error(error.message, {
                richColors: true,
            });
        },
    });
};

// Resend otp mutation
export const useResendOtp = () => {
    return useMutation({
        mutationFn: async (data: { email: string; purpose: string }) => {
            return await apiClient.post<ApiResponse<{ code: string; expiry: string }>>('/resend-otp', data);
        },
    });
};

// Forgot password mutation
export const useForgetPassword = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: { email: string }) => {
            return await apiClient.post<ApiResponse<null>>('/forgot-password', data);
        },
        onSuccess: () => {
            toast.success('Verification code is sent to your email', {
                richColors: true,
            });
            router.push('/verify/password');
        },
        onError: (error) => {
            toast.error(error.message, {
                richColors: true,
            });
        },
    });
};

// Verify password mutation
export const useVerifyPassword = () => {
    const router = useRouter();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: async (data: { email: string; otp: string; newPassword: string }) => {
            return await apiClient.post<ApiResponse<null>>('/verify-password', data);
        },
        onSuccess: () => {
            toast.success('Reset password success', {
                richColors: true,
            });
            router.push('/login');
            const timeout = setTimeout(() => authStore.setVerifyId(null), 0);
            clearTimeout(timeout);
        },
        onError: (error) => {
            toast.error(error.message, {
                richColors: true,
            });
        },
    });
};
