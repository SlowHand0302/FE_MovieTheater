import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Calendar } from 'lucide-react';
import { Cinema } from '@/interfaces/Cinema.interface';
import CinemaBadge from '../../components/CinemaBadge';

interface CinemaCardProps {
    cinema: Cinema;
}

const CinemaCard = ({ cinema }: CinemaCardProps) => {
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
            <Card className="w-full gap-2 ">
                <CardHeader className="rounded-t-lg">
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
                        <div className="flex-1 flex gap-1 sm:flex-row flex-col bg-blue-50 rounded-lg p-2 border border-blue-100">
                            <div className="space-x-2 p-3 rounded-lg flex-0">
                                <p className="text-xs font-semibold text-blue-900">ID</p>
                                <p className="text-sm font-mono text-blue-700">{cinema.id}</p>
                            </div>
                            <div className="flex gap-1 w-full">
                                <div className="flex w-full items-start space-x-2 bg-gray-50 p-3 rounded-lg">
                                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600">Created</p>
                                        <p className="text-xs text-gray-500">{formatDate(cinema.createdAt)}</p>
                                        <p className="text-xs text-gray-400 mt-1">By: {cinema.createdBy}</p>
                                    </div>
                                </div>
                                <div className="flex w-full shrink items-start space-x-2 bg-gray-50 p-3 rounded-lg">
                                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600">Last Updated</p>
                                        <p className="text-xs text-gray-500">{formatDate(cinema.updatedAt)}</p>
                                        <p className="text-xs text-gray-400 mt-1">By: {cinema.updatedBy}</p>
                                    </div>
                                </div>
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
        </div>
    );
};

export default CinemaCard;
