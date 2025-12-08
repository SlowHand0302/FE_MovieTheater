'use client';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

import { GalleryVerticalEnd } from 'lucide-react';

import { useAuthStore } from '@/features/auth/useAuthStore';

const Layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { verifyId } = useAuthStore();

    useEffect(() => {
        if (!verifyId) {
            router.replace('/');
            toast.warning('You do not have permission to navigate to this page', {
                richColors: true,
            });
        }
    }, [verifyId, router]);

    if (!verifyId) return null;

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Cine Inc.
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">{children}</div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://ui.shadcn.com/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
};

export default Layout;
