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
import { GalleryVerticalEnd } from 'lucide-react';
import Account from '@/components/AccountDropdown';
import SearchBar from '@/components/Searchbar';
import Overlay from '@/components/Overlay';

const components: { title: string; href: string; description: string }[] = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description: 'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description: 'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description:
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
];

export function Header() {
    const [openSearchBar, setOpenSearchBar] = React.useState<boolean>(false);

    return (
        <>
            <NavigationMenu className="w-full justify-between p-3 bg-white max-w-[1850px] 2xl:mx-auto">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            asChild
                            className={`${navigationMenuTriggerStyle()} flex items-center justify-center`}
                        >
                            <Link href="/" passHref>
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
                        <NavigationMenuTrigger>Danh Sách Phim</NavigationMenuTrigger>
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
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/docs" passHref>
                                Sự kiện và Tin Tức
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="md:block hidden">
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/docs" passHref>
                                Rạp và Giá Vé
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuList className="items-center h-full flex cursor-pointer">
                    <NavigationMenuItem onClick={() => setOpenSearchBar(true)}>
                        <Command className="rounded-lg border xl:min-w-[450px]">
                            <CommandInput
                                placeholder="Type a command or search..."
                                className="cursor-pointer"
                                readOnly
                            />
                        </Command>
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
