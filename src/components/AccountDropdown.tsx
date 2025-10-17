import { Sparkles, BadgeCheck, LogOut, Bell } from 'lucide-react';
import React from 'react';
import { Separator } from './ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const items = [
    {
        lable: 'Account',
        url: '#',
        icon: BadgeCheck,
    },
    {
        lable: 'Notification',
        url: '#',
        icon: Bell,
    },
    {
        lable: 'Log out',
        url: '#',
        icon: LogOut,
    },
];

function Account() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm cursor-pointer">
                    <Avatar className="h-8 w-8 rounded-full bg-gray-200 items-center justify-center flex">
                        <AvatarImage src="https://github.com/shadcn.png" alt={'user.name'} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="sm:grid hidden flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{'user.name'}</span>
                        <span className="truncate text-xs">{'user.email'}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 rounded-lg bg-white shadow-xl border border-gray-200 flex flex-col gap-2 p-2 mt-3">
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-full bg-gray-200 items-center justify-center flex cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" alt={'user.name'} />
                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{'username'}</span>
                            <span className="truncate text-xs">{'user.email'}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <Separator orientation="horizontal" className="bg-gray-200 w-full" />
                {items.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="flex items-center justify-start gap-2 text-[14px] hover:bg-slate-100 hover:outline-none px-[16px] py-[10px] rounded-sm cursor-pointer">
                                    <item.icon className="flex-shrink-0 size-4" />
                                    {item.lable}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </React.Fragment>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default Account;
