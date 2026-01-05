'use client';
import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth/useAuthStore';
import { useUserProfile } from '@/features/user/queries/profile.query';

const AuthInitializer = () => {
    const { setUser, user } = useAuthStore();

    // ❗ Always call the hook – no conditional rendering
    const { data, isError } = useUserProfile(!user);
    if (isError) {
        console.log('data');
    }
    // Set user only when correct role
    useEffect(() => {
        if (data && !user) {
            setUser(data);
        }
    }, [data, setUser]);

    return null;
};

export default AuthInitializer;
