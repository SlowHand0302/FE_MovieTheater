import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient';
import { authStorage } from '@/lib/authStorage';
import { User } from '@/interfaces/User.interface';
import { queryClient } from '@/lib/queryClient.config';
import { ApiResponse } from '@/types/ApiResponse.type';

// Login mutation
export const useLoginMutation = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: Pick<User, 'email' | 'password'>) => {
            return apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/sign-in', credentials);
        },
        onSuccess: (res) => {
            if (res.result) {
                const { accessToken, refreshToken } = res.data as { accessToken: string; refreshToken: string };
                authStorage.setTokens(accessToken, refreshToken);
                queryClient.setQueryData(['auth-user'], accessToken);
                toast.success('Login Success', {
                    richColors: true,
                });
                router.push('/');
            }
        },
        onError: (error) => {
            authStorage.clearTokens();
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

    return useMutation({
        mutationFn: async (data: Pick<User, 'email' | 'password' | 'fullname'>) => {
            return apiClient.post<ApiResponse<null>>('/register', data);
        },
        onSuccess: () => {
            toast.success('Register Success', {
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

// Logout mutation
export const useLogoutMutation = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            return await apiClient.post('/sign-out');
        },
        onSuccess: () => {
            authStorage.clearTokens();
            queryClient.setQueryData(['auth-user'], null);
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
