'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import CinemaForm from '../../components/CinemaForm';
import CinemaBadge from '../../components/CinemaBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, ChevronLeft, SquarePen } from 'lucide-react';

import { useCinema } from '@/features/cinema/queries';
import { Cinema } from '@/interfaces/Cinema.interface';

const CinemaCard = () => {
    const { id: cinemaId } = useParams<{ id: string }>();
    const { data = {}, isPending, isError, error } = useCinema(cinemaId);
    const cinema = data as Cinema;
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>{error.message}</div>;

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full gap-2 ">
                <CardHeader className="rounded-t-lg">
                    <div className="flex justify-between items-center border-b border-slate-300 pb-2">
                        <Link passHref href={`/admin/cinema`}>
                            <Button variant={'outline'}>
                                <ChevronLeft /> Back
                            </Button>
                        </Link>
                        <Button variant={'outline'} onClick={() => setOpenFormDialog(true)}>
                            <SquarePen />
                        </Button>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl font-bold mb-2">{cinema.name}</CardTitle>
                            <CardDescription className="text-lg">{cinema.city}</CardDescription>
                        </div>
                        <CinemaBadge status={cinema.status} className="capitalize text-sm px-3 py-1" />
                    </div>
                </CardHeader>

                <CardContent className="">
                    <div className="flex gap-4 xl:flex-row flex-col">
                        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                            <div className="space-x-2 p-3 rounded-lg flex-0">
                                <p className="text-xs font-semibold text-blue-900">ID</p>
                                <p className="text-sm font-mono text-blue-700">{cinema.id}</p>
                            </div>
                        </div>

                        <div className="flex-1 flex gap-4 sm:flex-row flex-col">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Address</p>
                                        <p className="text-sm text-gray-600">{cinema.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Operating Hours</p>
                                        <p className="text-sm text-gray-600">
                                            {cinema.open_Time} - {cinema.close_Time}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 flex-1">
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Phone</p>
                                        <p className="text-sm text-gray-600">{cinema.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Email</p>
                                        <p className="text-sm text-gray-600">{cinema.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <CinemaForm cinema={cinema} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </div>
    );
};

export default CinemaCard;
