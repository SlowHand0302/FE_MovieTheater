import React, { ReactNode } from 'react';
import { Header } from './components/Header';
import { GlobalTrailerProvider } from '@/providers/TrailerContext.provider';

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <GlobalTrailerProvider>
            <Header></Header>
            <main className="mb-3 mx-5 max-w-[1850px] min-h-screen 2xl:mx-auto 2xl:px-5">{children}</main>
            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2024 Cine Inc Theater. All rights reserved.</p>
                </div>
            </footer>
        </GlobalTrailerProvider>
    );
};

export default layout;
