export const authStorage = {
    setTokens: (accessToken: string, refreshToken?: string) => {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    getAccessToken: (): string | null => {
        return localStorage.getItem('accessToken');
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem('refreshToken');
    },

    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    hasTokens: (): boolean => {
        return !!localStorage.getItem('accessToken');
    },
};
