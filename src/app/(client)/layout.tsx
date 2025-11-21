import React, { ReactNode } from 'react';
import { Header } from './components/Header';

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header></Header>
            <main className="mb-3 mx-5 max-w-[1850px] 2xl:mx-auto">{children}</main>
            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2024 Cine Inc Theater. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default layout;
