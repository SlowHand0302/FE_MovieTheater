'use client';
import React, { ReactNode } from 'react';
import RoomCard from './components/RoomCard';

const RoomDetailLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="p-3 space-y-2">
            <RoomCard />
            {children}
        </main>
    );
};

export default RoomDetailLayout;
