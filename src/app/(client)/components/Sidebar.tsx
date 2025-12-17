'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ChevronRight, GalleryVerticalEnd } from 'lucide-react';
import { DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import Account from '@/components/AccountDropdown';
import { sidebarItems } from '@/constants/clientSidebarItems.constant';

export function ClientSidebar({ ...props }: React.ComponentProps<typeof DrawerContent>) {
    return (
        <DrawerContent {...props}>
            <DrawerHeader>
                <DrawerClose asChild>
                    <Link href="/" passHref className="bg-transparent">
                        <DrawerTitle className="flex justify-center gap-2 md:justify-start">
                            <div className="flex items-center gap-2 font-medium">
                                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                    <GalleryVerticalEnd className="size-4 text-white" />
                                </div>
                                Cine Inc.
                            </div>
                        </DrawerTitle>
                    </Link>
                </DrawerClose>
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-1">
                {sidebarItems.map((item, index) => {
                    return item.children ? (
                        <Collapsible key={index}>
                            <CollapsibleTrigger asChild className="w-full">
                                <Button variant={'ghost'} className="justify-between">
                                    {item.name}
                                    <ChevronRight className="transition-transform duration-200 [[data-state='open']>&]:rotate-90" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="flex flex-col gap-2 mx-3 pl-2 border-l-2">
                                {item.children.map((child, index) => {
                                    return (
                                        <DrawerClose key={index} asChild>
                                            <Link passHref href={child.url} key={index}>
                                                <Button variant={'ghost'} className="justify-start w-full">
                                                    {child.name}
                                                </Button>
                                            </Link>
                                        </DrawerClose>
                                    );
                                })}
                            </CollapsibleContent>
                        </Collapsible>
                    ) : (
                        <DrawerClose key={index} asChild>
                            <Link passHref href={item.url}>
                                <Button variant={'ghost'} className="justify-start w-full px-3">
                                    {item.name}
                                </Button>
                            </Link>
                        </DrawerClose>
                    );
                })}
            </div>
            <DrawerFooter>
                <Account />
            </DrawerFooter>
        </DrawerContent>
    );
}
