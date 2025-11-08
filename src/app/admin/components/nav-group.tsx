'use client';
import Link from 'next/link';
import React, { ComponentPropsWithoutRef } from 'react';

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NavItem } from '@/types/NavItem.type';
import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavProps extends ComponentPropsWithoutRef<typeof SidebarGroup> {
    items: NavItem[];
    groupLabel?: string;
}

const NavGroup = ({ items, groupLabel, ...props }: NavProps) => {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent className="flex flex-col">
                {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
                <SidebarMenu>
                    {items.map((item, index) => {
                        return item.children ? (
                            <CollapsibleNavItem key={index} item={item} />
                        ) : (
                            <MainNavItem key={index} item={item} />
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

const MainNavItem = ({ item }: { item: NavItem }) => {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.name} asChild>
                <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

const CollapsibleNavItem = ({ item }: { item: NavItem }) => {
    return (
        <Collapsible key={item.name} asChild className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.name}>
                        {item.icon && <item.icon />}
                        <span>{item.name}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.name}>
                                <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.name}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default NavGroup;
