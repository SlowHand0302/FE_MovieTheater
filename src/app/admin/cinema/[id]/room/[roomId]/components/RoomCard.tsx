import Link from 'next/link';
import React, { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import RoomForm from '../../../components/RoomForm';
import RoomBadge from '../../../components/RoomBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Grid3x3, Building2, Users, Tag, SquarePen, ChevronLeft, Armchair, CalendarCog } from 'lucide-react';

import { useRoom } from '@/features/room/queries';
import { Room } from '@/interfaces/Room.interface';
import { useCinema } from '@/features/cinema/queries';
import { Cinema } from '@/interfaces/Cinema.interface';

const RoomCard = () => {
    const pathname = usePathname();
    const { id: cinemaId, roomId } = useParams<{ id: string; roomId: string }>();
    const { data: roomData = {}, isPending: roomPending, isError: roomError } = useRoom({ cinemaId, roomId });
    const { data: cinemaData, isPending: cinemaPending, isError: cinemaError } = useCinema(cinemaId);

    const cinema = cinemaData as Cinema;
    const room = roomData as Room;
    const totalSeats = room.totalColumn * room.totalRow;

    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    console.log(pathname);

    if (roomPending || cinemaPending) return <div>Loading...</div>;
    if (roomError || cinemaError) return <div>Something wrong happened.</div>;

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full gap-2 pt-4">
                <CardHeader className="rounded-t-lg">
                    <div className="flex justify-between items-center border-b border-slate-300 pb-2 ">
                        <div className="space-x-3">
                            <Link passHref href={`/admin/cinema/${cinemaId}`}>
                                <Button variant={'outline'}>
                                    <ChevronLeft /> Back
                                </Button>
                            </Link>
                            <Link passHref href={`/admin/cinema/${cinemaId}/room/${roomId}/seats`}>
                                <Button variant={pathname.includes('seats') ? 'default' : 'outline'}>
                                    <Armchair /> Manage Seat Layout
                                </Button>
                            </Link>
                            <Link passHref href={`/admin/cinema/${cinemaId}/room/${roomId}/show-times`}>
                                <Button variant={pathname.includes('show-times') ? 'default' : 'outline'}>
                                    <CalendarCog /> Manage Showtime
                                </Button>
                            </Link>
                        </div>
                        <Button variant={'outline'} onClick={() => setOpenFormDialog(true)}>
                            <SquarePen />
                        </Button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="self-start bg-muted-foreground/20 p-3 rounded-lg">
                            <Film className="w-8 h-8" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold mb-2 flex items-center gap-3">
                                Room {room.roomNumber}
                                <RoomBadge status={room.status} className="capitalize text-sm px-3 py-1" />
                            </CardTitle>
                            <CardDescription className="text-lg inline-flex lg:gap-2 gap-0 lg:flex-row flex-col">
                                <span>{cinema.name}</span> <span className="lg:inline-block hidden">-</span>{' '}
                                <span>{cinema.city}</span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex gap-3 xl:flex-row flex-col">
                    {/* Room Details */}
                    <div className="flex-1 min-h-full flex gap-3 sm:flex-row flex-col">
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
                            <p className="text-sm font-mono text-purple-700">{cinema.id}</p>
                        </div>

                        <div className="bg-pink-50 rounded-lg p-4 border flex-1 border-pink-100">
                            <div className="flex items-center space-x-2 mb-2">
                                <Tag className="w-4 h-4 text-pink-600" />
                                <p className="text-xs font-semibold text-pink-900">Room Type</p>
                            </div>
                            <p className="text-sm font-bold text-pink-700">{room.roomType}</p>
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
                                    <span className="text-lg font-bold text-blue-700">{room.totalRow}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Columns</span>
                                    <span className="text-lg font-bold text-blue-700">{room.totalColumn}</span>
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
            <RoomForm room={room} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </div>
    );
};

export default RoomCard;
