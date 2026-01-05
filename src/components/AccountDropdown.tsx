'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { BadgeCheck, LogOut, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { useAuthStore } from '@/features/auth/useAuthStore';
import { useLogoutMutation } from '@/features/auth/mutations';

function Account() {
    const router = useRouter();
    const pathname = usePathname();

    const [openDropdown, setOpenDropdown] = useState(false);

    const { user } = useAuthStore();
    const { mutate } = useLogoutMutation();

    const handleOpen = () => {
        if (user) {
            setOpenDropdown(!openDropdown);
        } else {
            router.push('/login');
        }
    };

    return (
        <DropdownMenu modal={false} open={openDropdown} onOpenChange={handleOpen}>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer">
                    <Avatar className="h-8 w-8 rounded-full bg-gray-200 items-center justify-center flex">
                        <AvatarImage src="https://github.com/shadcn.png" alt={user?.fullName || 'username'} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="sm:grid hidden flex-1 max-w-full text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.fullName || 'Login'}</span>
                        <span className="truncate line-clamp-1 text-xs">{user?.email || ''}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 rounded-lg bg-white shadow-xl border border-gray-200 flex flex-col gap-2 p-2 mt-3">
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-full bg-gray-200 items-center justify-center flex cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" alt={user?.fullName || 'username'} />
                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user?.fullName || 'username'}</span>
                            <span className="truncate text-xs">{user?.email || ''}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <Separator orientation="horizontal" className="bg-gray-200 w-full" />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => router.push(pathname.includes('admin') ? '/admin/profile' : '/profile')}
                        className="flex items-center justify-start gap-2 text-[14px] hover:bg-slate-100 hover:outline-none px-[16px] py-[10px] rounded-sm cursor-pointer"
                    >
                        <BadgeCheck className="flex-shrink-0 size-4" />
                        Account
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center justify-start gap-2 text-[14px] hover:bg-slate-100 hover:outline-none px-[16px] py-[10px] rounded-sm cursor-pointer">
                        <Bell className="flex-shrink-0 size-4" />
                        Notification
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => mutate()}
                        className="flex items-center justify-start gap-2 text-[14px] hover:bg-slate-100 hover:outline-none px-[16px] py-[10px] rounded-sm cursor-pointer"
                    >
                        <LogOut className="flex-shrink-0 size-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Account;
