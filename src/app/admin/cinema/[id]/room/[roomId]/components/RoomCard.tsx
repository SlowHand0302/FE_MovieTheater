import React from 'react';

import RoomBadge from '../../../components/RoomBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Grid3x3, Calendar, User, Building2, Users, Tag } from 'lucide-react';

import { Room } from '@/interfaces/Room.interface';
import { dummyCinemas } from '@/features/cinema/constants/dummyData.constant';
import { dummyRoomTypes } from '@/features/room-type/constants/dummyData.constant';

interface RoomCardProps {
    room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
    const cinema = dummyCinemas.filter((cinema) => cinema.id === room.cinemaId)[0];
    const roomType = dummyRoomTypes.filter((type) => type.id === room.roomTypeId)[0];
    const totalSeats = room.total_Column * room.total_Row;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full gap-2">
                <CardHeader className="rounded-t-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-muted-foreground/20 p-3 rounded-lg">
                                <Film className="w-8 h-8" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-bold mb-2">Room {room.roomNumber}</CardTitle>
                                <CardDescription className="text-lg inline-flex lg:gap-2 gap-0 lg:flex-row flex-col">
                                    <span>{cinema.name}</span> <span className="lg:inline-block hidden">-</span>{' '}
                                    <span>{cinema.city}</span>
                                </CardDescription>
                            </div>
                        </div>
                        <RoomBadge status={room.status} className="capitalize text-sm px-3 py-1" />
                    </div>
                </CardHeader>

                <CardContent className="flex gap-3 xl:flex-row flex-col">
                    {/* Room Details */}
                    <div className="flex-1">
                        <div className="flex gap-3 mb-3">
                            <div className="bg-indigo-50 rounded-lg p-4 border flex-1 border-indigo-100">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Tag className="w-4 h-4 text-indigo-600" />
                                    <p className="text-xs font-semibold text-indigo-900">Room ID</p>
                                </div>
                                <p className="text-sm font-mono text-indigo-700">{room.id}</p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4 border flex-1 border-purple-100">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Building2 className="w-4 h-4 text-purple-600" />
                                    <p className="text-xs font-semibold text-purple-900">Cinema ID</p>
                                </div>
                                <p className="text-sm font-mono text-purple-700">{room.cinemaId}</p>
                            </div>

                            <div className="bg-pink-50 rounded-lg p-4 border flex-1 border-pink-100">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Tag className="w-4 h-4 text-pink-600" />
                                    <p className="text-xs font-semibold text-pink-900">Room Type</p>
                                </div>
                                <p className="text-sm font-mono text-pink-700">{roomType.type}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 border-t pt-3">
                            <div className="flex-1 flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-600">Created</p>
                                    <p className="text-sm text-gray-700 mt-0.5">{formatDate(room.createdAt)}</p>
                                    <div className="flex items-center space-x-1 mt-2">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <p className="text-xs text-gray-500">By: {room.createdBy}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-600">Last Updated</p>
                                    <p className="text-sm text-gray-700 mt-0.5">{formatDate(room.updatedAt)}</p>
                                    <div className="flex items-center space-x-1 mt-2">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <p className="text-xs text-gray-500">By: {room.updatedBy}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Layout Summary */}
                    <div className="flex-1 flex gap-3">
                        <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center space-x-2 mb-3">
                                <Grid3x3 className="w-5 h-5 text-blue-600" />
                                <p className="text-sm font-semibold text-blue-900">Seating Layout</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Rows</span>
                                    <span className="text-lg font-bold text-blue-700">{room.total_Row}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Columns</span>
                                    <span className="text-lg font-bold text-blue-700">{room.total_Column}</span>
                                </div>
                                <div className="pt-2 border-t border-blue-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Total Seats</span>
                                        <span className="text-xl font-bold text-blue-900">{totalSeats}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-emerald-50 rounded-lg p-4 border border-emerald-200 flex flex-col items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-emerald-900 mb-1">Capacity</p>
                            <p className="text-2xl font-bold text-emerald-700">{totalSeats}</p>
                            <p className="text-xs text-emerald-600 mt-1">seats available</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoomCard;
