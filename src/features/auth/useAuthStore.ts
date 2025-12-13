import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/interfaces/User.interface';

interface AuthState {
    user: User | null;
    verifyId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (access: string, refresh: string) => void;
    setVerifyId: (id: string | null) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            verifyId: null,
            accessToken: null,
            refreshToken: null,
            setTokens(access, refresh) {
                set({ accessToken: access, refreshToken: refresh });
            },
            setVerifyId(id) {
                set({ verifyId: id });
            },
            setUser(user) {
                set({ user });
            },
            logout() {
                set({ user: null, accessToken: null, refreshToken: null, verifyId: null });
            },
        }),
        {
            name: 'auth-store',
            // Optionally: only persist tokens, not user data
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        },
    ),
);
