import React, { ReactNode } from 'react';
import { AppSidebar } from './components/app-sidebar';
import { SiteHeader } from './components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { GlobalTrailerProvider } from '@/providers/TrailerContext.provider';

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <GlobalTrailerProvider>
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">{children}</div>
                    </div>
                </GlobalTrailerProvider>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default layout;
