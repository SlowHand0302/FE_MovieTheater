'use client';

import * as React from 'react';
import {
    IconDoor,
    IconHelp,
    IconReport,
    IconUserCog,
    IconSettings,
    IconChartBar,
    IconDashboard,
    IconMapPinCog,
    IconInnerShadowTop,
} from '@tabler/icons-react';

import { NavDocuments } from '@/app/admin/components/nav-documents';
import { NavMain } from '@/app/admin/components/nav-main';
import { NavSecondary } from '@/app/admin/components/nav-secondary';
import { NavUser } from '@/app/admin/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '#',
            icon: IconDashboard,
        },
        {
            title: 'Analytics',
            url: '#',
            icon: IconChartBar,
        },
        {
            title: 'Reports',
            url: '#',
            icon: IconReport,
        },
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: IconSettings,
        },
        {
            title: 'Get Help',
            url: '#',
            icon: IconHelp,
        },
    ],
    documents: [
        {
            name: 'Cinema',
            url: '#',
            icon: IconMapPinCog,
        },
        {
            name: 'Room',
            url: '#',
            icon: IconDoor,
        },
        {
            name: 'Accounts',
            url: '#',
            icon: IconUserCog,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Cine Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
