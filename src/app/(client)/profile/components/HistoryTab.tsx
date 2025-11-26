import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Calendar, MapPin, CreditCard, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock ticket purchase history
const mockTicketHistory = [
    {
        id: 'TKT-001',
        movieTitle: 'Oppenheimer',
        showDate: new Date('2024-11-20T19:30:00'),
        theater: 'Screen 1',
        seats: ['A12', 'A13'],
        totalAmount: 32.0,
        paymentMethod: 'Credit Card',
        status: 'completed',
        bookingDate: new Date('2024-11-18'),
        pointsEarned: 32,
    },
    {
        id: 'TKT-002',
        movieTitle: 'Barbie',
        showDate: new Date('2024-11-10T15:00:00'),
        theater: 'Screen 3',
        seats: ['D5', 'D6', 'D7'],
        totalAmount: 48.0,
        paymentMethod: 'Debit Card',
        status: 'completed',
        bookingDate: new Date('2024-11-08'),
        pointsEarned: 48,
    },
    {
        id: 'TKT-003',
        movieTitle: 'Dune: Part Two',
        showDate: new Date('2024-12-05T20:00:00'),
        theater: 'Screen 2 - IMAX',
        seats: ['F10', 'F11'],
        totalAmount: 42.0,
        paymentMethod: 'Credit Card',
        status: 'upcoming',
        bookingDate: new Date('2024-11-22'),
        pointsEarned: 42,
    },
    {
        id: 'TKT-004',
        movieTitle: 'The Holdovers',
        showDate: new Date('2024-10-28T18:30:00'),
        theater: 'Screen 4',
        seats: ['B8'],
        totalAmount: 16.0,
        paymentMethod: 'Points Redemption',
        status: 'completed',
        bookingDate: new Date('2024-10-25'),
        pointsEarned: 0,
    },
    {
        id: 'TKT-005',
        movieTitle: 'Poor Things',
        showDate: new Date('2024-10-15T21:00:00'),
        theater: 'Screen 1',
        seats: ['C15', 'C16'],
        totalAmount: 34.0,
        paymentMethod: 'Credit Card',
        status: 'completed',
        bookingDate: new Date('2024-10-12'),
        pointsEarned: 34,
    },
];

const HistoryTab = () => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Purchase Summary</CardTitle>
                    <CardDescription>Your spending and rewards overview</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
                            <p className="text-2xl font-bold">{mockTicketHistory.length}</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                            <p className="text-2xl font-bold">
                                ${mockTicketHistory.reduce((sum, t) => sum + t.totalAmount, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Points Earned</p>
                            <p className="text-2xl font-bold">
                                {mockTicketHistory.reduce((sum, t) => sum + t.pointsEarned, 0)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ticket Purchase History</CardTitle>
                    <CardDescription>View all your past and upcoming movie bookings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockTicketHistory.map((ticket) => {
                            const isPast = new Date(ticket.showDate) < new Date();
                            const isUpcoming = ticket.status === 'upcoming';

                            return (
                                <div
                                    key={ticket.id}
                                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Ticket className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-lg">{ticket.movieTitle}</h3>
                                                    <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                                                        {isUpcoming ? 'Upcoming' : 'Completed'}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <p className="flex items-center gap-2">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(ticket.showDate).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {ticket.theater}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <Ticket className="h-3.5 w-3.5" />
                                                        Seats: {ticket.seats.join(', ')}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <CreditCard className="h-3.5 w-3.5" />
                                                        {ticket.paymentMethod}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 md:text-right">
                                            <div>
                                                <p className="text-2xl font-bold">${ticket.totalAmount.toFixed(2)}</p>
                                                {ticket.pointsEarned > 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        +{ticket.pointsEarned} points earned
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Receipt
                                                </Button>
                                                {isUpcoming && <Button size="sm">View Ticket</Button>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                                        Booking ID: {ticket.id} • Booked on{' '}
                                        {new Date(ticket.bookingDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default HistoryTab;
