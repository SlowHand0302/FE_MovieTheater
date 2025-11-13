'use client';
import React from 'react';
import RoomCard from './components/RoomCard';
import { useParams } from 'next/navigation';
import { dummyRooms } from '@/features/room/constants/dummyData.constant';
import CinemaSeatAdmin from './components/SeatLayout';

const Page = () => {
    const dynamicParams = useParams();
    const room = dummyRooms.filter((room) => room.id === dynamicParams.roomId)[0];

    return (
        <main className="p-3 space-y-2">
            <RoomCard room={room} />
            <CinemaSeatAdmin />
        </main>
    );
};

export default Page;
