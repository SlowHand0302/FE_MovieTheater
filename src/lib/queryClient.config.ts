import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 10,
            retryDelay: 5000,
            throwOnError: false,
        },
        mutations: {
            throwOnError: false,
        },
    },
});
