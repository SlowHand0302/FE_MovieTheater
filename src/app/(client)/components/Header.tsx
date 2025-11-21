'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
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
import { GalleryVerticalEnd, Search } from 'lucide-react';
import Account from '@/components/AccountDropdown';
import SearchBar from '@/components/Searchbar';
import Overlay from '@/components/Overlay';
import { Button } from '@/components/ui/button';

export function Header() {
    const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);

    return (
        <>
            <NavigationMenu className="justify-between fixed top-0 left-1/2 -translate-x-1/2 z-10 backdrop-blur-sm p-3 max-w-full w-[1850px] 2xl:mx-auto">
                <NavigationMenuList>
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
                    <NavigationMenuItem className="md:block hidden">
                        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent">
                            Danh Sách Phim
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <ListItem href="/docs" title="Phim Đang Chiếu">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate facere deleniti
                                    rerum, laborum hic veritatis nesciunt eum ratione necessitatibus enim, molestias
                                    inventore ipsa placeat, iste quod qui ut in temporibus?{' '}
                                </ListItem>
                                <ListItem href="/docs/installation" title="Phim Sắp Chiếu">
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et, est? Officia quia
                                    perferendis voluptatibus quae, harum sed maiores nemo laborum molestias error unde
                                    maxime vero neque ex inventore tempora veniam.{' '}
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="md:block hidden">
                        <NavigationMenuLink
                            asChild
                            className={`${navigationMenuTriggerStyle()} hover:bg-transparent focus:bg-transparent`}
                        >
                            <Link href="/docs" passHref className="bg-transparent">
                                Sự kiện và Tin Tức
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="md:block hidden">
                        <NavigationMenuLink
                            asChild
                            className={`${navigationMenuTriggerStyle()} hover:bg-transparent focus:bg-transparent`}
                        >
                            <Link href="/docs" passHref className="bg-transparent">
                                Rạp và Giá Vé
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuList className="items-center h-full flex cursor-pointer">
                    <NavigationMenuItem onClick={() => setOpenSearchBar(true)}>
                        <Command className="rounded-lg border bg-accent/50 border-none hidden md:block xl:min-w-[450px]">
                            <CommandInput
                                placeholder="Type a command or search..."
                                className="cursor-pointer"
                                readOnly
                            />
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
            {openSearchBar && (
                <Overlay classname="flex justify-center items-start pt-40" onClick={() => setOpenSearchBar(false)}>
                    <SearchBar />
                </Overlay>
            )}
        </>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    },
);

ListItem.displayName = 'ListItem';
