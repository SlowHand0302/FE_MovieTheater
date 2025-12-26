'use client';
import React from 'react';
import RoomCard from './components/RoomCard';
import CinemaSeatAdmin from './components/SeatLayout';

const Page = () => {
    return (
        <main className="p-3 space-y-2">
            <RoomCard />
            <CinemaSeatAdmin />
        </main>
    );
};

export default Page;
