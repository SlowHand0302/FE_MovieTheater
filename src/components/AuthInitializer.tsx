'use client';
import { useEffect, useMemo } from 'react';

import { decodeJWT } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useCustomerProfile } from '@/features/user/queries/customer.query';

const AuthInitializer = () => {
    const { accessToken, setUser } = useAuthStore();

    // Decode token once
    const decoded = useMemo(() => {
        return accessToken ? decodeJWT(accessToken) : null;
    }, [accessToken]);

    const userId = decoded?.id;
    const role = decoded?.role;

    // ❗ Always call the hook – no conditional rendering
    const { data, isError } = useCustomerProfile(userId ?? '');
    if (isError) {
        console.log('data');
    }
    // Set user only when correct role
    useEffect(() => {
        if (role === 'customer' && data) {
            setUser(data);
        }
    }, [role, data, setUser]);

    return null;
};

export default AuthInitializer;
