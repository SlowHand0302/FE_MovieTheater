import React, { ReactNode } from 'react';
import { Header } from './components/Header';

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header></Header>
            <main className="my-3 mx-5 max-w-[1850px] 2xl:mx-auto">{children}</main>
        </>
    );
};

export default layout;
