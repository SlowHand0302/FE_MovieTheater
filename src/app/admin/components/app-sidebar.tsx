'use client';

import * as React from 'react';
import Link from 'next/link';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import NavGroup from './nav-group';
import { IconInnerShadowTop } from '@tabler/icons-react';
import { navMain, navManagement, navSecondary } from '@/constants/adminSidebarItems.constant';
import Account from '@/components/AccountDropdown';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <Link href="/admin/dashboard">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Cine Inc.</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavGroup items={navMain} groupLabel="Main" />
                <NavGroup items={navManagement} groupLabel="Management" />
                <NavGroup items={navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <Account />
            </SidebarFooter>
        </Sidebar>
    );
}
