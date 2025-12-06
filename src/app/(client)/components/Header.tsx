'use client';

import * as React from 'react';
import Link from 'next/link';
import { GalleryVerticalEnd, Search } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Command, CommandInput } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Account from '@/components/AccountDropdown';

export function Header() {
    const isMobile = useIsMobile();

    return (
        <NavigationMenu
            viewport={isMobile}
            className="justify-between shadow-sm fixed top-0 left-1/2 -translate-x-1/2 z-10 backdrop-blur-sm p-3 max-w-full w-[1850px] 2xl:mx-auto"
        >
            <NavigationMenuList className="flex-wrap">
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className={`${navigationMenuTriggerStyle()} flex items-center justify-center hover:bg-transparent`}
                    >
                        <Link href="/" passHref className="bg-transparent">
                            <div className="flex justify-center gap-2 md:justify-start">
                                <div className="flex items-center gap-2 font-medium">
                                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                        <GalleryVerticalEnd className="size-4 text-white" />
                                    </div>
                                    Cine Inc.
                                </div>
                            </div>
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                    <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent">
                        Danh sách phim
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link href="/movie">Phim đang chiếu</Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link href="/movie">Phim sắp chiếu</Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                    <NavigationMenuLink
                        asChild
                        className={cn(
                            navigationMenuTriggerStyle(),
                            'bg-transparent hover:bg-transparent focus:bg-transparent',
                        )}
                    >
                        <Link href="/movie">Sự kiện và Tin Tức</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:block">
                    <NavigationMenuLink
                        asChild
                        className={cn(
                            navigationMenuTriggerStyle(),
                            'bg-transparent hover:bg-transparent focus:bg-transparent',
                        )}
                    >
                        <Link href="/movie">Rạp và Giá Vé</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList className="items-center h-full flex cursor-pointer">
                <NavigationMenuItem>
                    <Command className="rounded-lg border bg-accent/50 border-none hidden md:block xl:min-w-[450px]">
                        <CommandInput placeholder="Type a command or search..." className="cursor-pointer" readOnly />
                    </Command>
                    <Button variant="ghost" className="block md:hidden">
                        <Search className="w-4 h-4" />
                    </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Account />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
