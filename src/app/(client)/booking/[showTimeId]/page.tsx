'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { mockMovies } from '@/features/movie/constants/dummyData.constant';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useShowTime, useShowTimeSeatByShowTime } from '@/features/show-time/queries';
import { ShowTimeSeatResult } from '@/features/show-time/DTOs/GetShowTimeSeat.dto';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SelectSeatTab from './components/SeatSelector';
import FoodDrinkSelector, { SelectedFoodDrink } from './components/FoodDrinkSelector';
import PaymentMethodTab from './components/PaymentMethodSelector';
import { useCreateBookingMutation } from '@/features/booking/mutations';
import { toast } from 'sonner';
import { useCreateTransactionMutation } from '@/features/payment/mutations';
import { CreateBookingResponse } from '@/features/booking/DTOs/CreateResponse.dto';
import { CreateTransactionResponse } from '@/features/payment/DTOs/CreateTransactionResponse.dto';
import { ShowtimeDetailResult } from '@/features/show-time/DTOs/GetShowTimes.dto';

const Page = () => {
    const router = useRouter();
    const dynamicParams = useParams();
    const showtimeId = dynamicParams.showTimeId as string;

    const {
        data: showtimeSeatData = [],
        isPending: showtimeSeatPending,
        isError: showtimeSeatError,
    } = useShowTimeSeatByShowTime(showtimeId);
    const { data: showtimeData = {}, isPending: showtimePending, isError: showtimeError } = useShowTime(showtimeId);
    const showtime = showtimeData as ShowtimeDetailResult;
    const showtimeSeats = showtimeSeatData as ShowTimeSeatResult[];

    const { mutate: createBooking } = useCreateBookingMutation();
    const { mutate: createTransaction } = useCreateTransactionMutation();

    const [currentTab, setCurrentTab] = useState('seat');

    const [selectedShowtimeSeats, setSelectedShowtimeSeats] = useState<ShowTimeSeatResult[]>([]);
    const [selectedFoodAndDrink, setSelectedFoodAndDrink] = useState<SelectedFoodDrink[]>([]);
    const [selectedMethod, setSelectedMethod] = React.useState<string>('vnpay');
    const [bookingId, setBookingId] = useState('');

    const handleShowTimeSeatClick = (seat: ShowTimeSeatResult) => {
        setSelectedShowtimeSeats((prev) => {
            return prev.find((item) => item.seatCode === seat.seatCode)
                ? prev.filter((item) => item.seatCode !== seat.seatCode)
                : [...prev, seat];
        });
    };

    const groupedSelectedShowtimeSeats = selectedShowtimeSeats.reduce(
        (acc, seat) => {
            const seatType = seat.seatType;
            if (!acc[seatType]) {
                acc[seatType] = [];
            }
            acc[seatType] = [...acc[seatType], seat];
            return acc;
        },
        {} as Record<string, ShowTimeSeatResult[]>,
    );

    const totalTimeSeatPrice =
        selectedShowtimeSeats.reduce((acc, seat) => {
            return acc + seat.price;
        }, 0) +
        selectedFoodAndDrink.reduce((acc, selected) => {
            return acc + selected.price * selected.quantity;
        }, 0);

    const handleOnBackClick = () => {
        if (currentTab === 'seat') router.push(`/movie/35bb3d42-eb29-4518-abbf-04bf7ae5b319`);
        if (currentTab === 'food&drink') setCurrentTab('seat');
        if (currentTab === 'payment') setCurrentTab('food&drink');
        if (currentTab === 'confirm') setCurrentTab('payment');
    };

    const handleOnNextClick = async () => {
        if (currentTab === 'seat' && selectedShowtimeSeats.length > 0) {
            setCurrentTab('food&drink');
        }
        if (currentTab === 'food&drink') {
            createBooking(
                {
                    showtimeId: showtimeId,
                    showtimeSeatIds: [...selectedShowtimeSeats.map((seat) => seat.showtimeSeatId)],
                    foodDrinkItems: [
                        ...selectedFoodAndDrink.map((selected) => ({
                            foodDrinkId: selected.id,
                            quantity: selected.quantity,
                        })),
                    ],
                },
                {
                    onError: (error) => {
                        toast.error(error.message, { richColors: true, position: 'top-center' });
                        router.push('/');
                    },
                    onSuccess: (res) => {
                        if (res.result) {
                            const data = res.data as CreateBookingResponse;
                            setBookingId(data.bookingId);
                            setCurrentTab('payment');
                        }
                    },
                },
            );
        }
        if (currentTab === 'payment') {
            // setCurrentTab('confirm');
            createTransaction(
                { bookingId: bookingId, paymentGateway: selectedMethod },
                {
                    onError: (error) => {
                        console.log(error);
                    },
                    onSuccess: (res) => {
                        if (res.result) {
                            const data = res.data as CreateTransactionResponse;
                            router.replace(data.paymentUrl);
                        }
                    },
                },
            );
        }
    };
    if (showtimePending || showtimeSeatPending) return <div>Loading...</div>;
    if (showtimeError || showtimeSeatError) return <div>There are something wrong happen.</div>;

    return (
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-5 gap-3 min-h-screen">
            {/* Seat Layout */}
            <div className="col-span-3 space-y-3">
                <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue="seat" className="h-full">
                    <TabsList className="grid w-full grid-cols-3" onClick={(event) => event.stopPropagation()}>
                        <TabsTrigger disabled className="disabled:opacity-100" value="seat">
                            Seat
                        </TabsTrigger>
                        <TabsTrigger disabled className="disabled:opacity-100" value="food&drink">
                            Food & Drink
                        </TabsTrigger>
                        <TabsTrigger disabled className="disabled:opacity-100" value="payment">
                            Payment
                        </TabsTrigger>
                        {/* <TabsTrigger value="confirm">Confirm</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="seat">
                        <SelectSeatTab
                            seats={showtimeSeats}
                            selectedSeats={selectedShowtimeSeats}
                            onSeatClick={handleShowTimeSeatClick}
                        />
                    </TabsContent>
                    <TabsContent value="food&drink" className="overflow-x-scroll max-h-[90vh] mt-3">
                        <FoodDrinkSelector
                            selectedValues={selectedFoodAndDrink}
                            onSelectionChange={setSelectedFoodAndDrink}
                        />
                    </TabsContent>
                    <TabsContent value="payment">
                        <PaymentMethodTab value={selectedMethod} onValueChange={setSelectedMethod} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Booking Details */}
            <div className="col-span-2">
                <Card>
                    <CardHeader className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={showtime.poster}
                            alt={showtime.movieName}
                            className="aspect-auto h-50 rounded-xl object-cover"
                        />
                        <div className="space-y-3">
                            <CardTitle className="text-2xl">{showtime.movieName}</CardTitle>
                            <CardDescription>
                                <span className="font-bold text-sm">{showtime.cinemaName}</span> - {showtime.city}
                            </CardDescription>
                            <CardDescription>
                                <span className="font-bold">RAP {showtime.roomNumber}</span> - {showtime.roomType}
                            </CardDescription>
                            <CardDescription>
                                Time:{' '}
                                <span className="font-bold">
                                    {new Date(showtime.startTime).toLocaleTimeString('vi-VN')}
                                </span>{' '}
                                - Date:{' '}
                                <span className="font-bold">
                                    {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                                </span>
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {selectedShowtimeSeats.length > 0 && (
                            <div className="space-y-3 border-t border-dashed py-3">
                                {Object.entries(groupedSelectedShowtimeSeats).map(([key, value], index) => {
                                    return (
                                        <div key={index} className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>
                                                    {groupedSelectedShowtimeSeats[key].length}x {key}
                                                </CardTitle>
                                                <CardDescription className="flex gap-2">
                                                    <p>Seat: </p>
                                                    {value.map((item, index) => (
                                                        <span key={index} className="font-bold">
                                                            {item.label}
                                                        </span>
                                                    ))}
                                                </CardDescription>
                                            </div>
                                            <CardTitle>
                                                {new Intl.NumberFormat('vi-Vn', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(
                                                    value.reduce((acc, seat) => {
                                                        return acc + seat.price;
                                                    }, 0),
                                                )}{' '}
                                            </CardTitle>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {selectedFoodAndDrink.length > 0 && (
                            <div className="space-y-3 border-t border-dashed py-3">
                                {selectedFoodAndDrink.map((selected, index) => {
                                    return (
                                        <div key={index} className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>
                                                    {selected.quantity}x {selected.name}
                                                </CardTitle>
                                            </div>
                                            <CardTitle>
                                                {new Intl.NumberFormat('vi-Vn', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(selected.price * selected.quantity)}{' '}
                                            </CardTitle>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex justify-between pt-6 text-2xl font-bold border-t border-dashed">
                            <p>Total: </p>
                            <p>
                                {new Intl.NumberFormat('vi-Vn', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(totalTimeSeatPrice)}{' '}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                        <Button variant={'outline'} className="flex-1" onClick={handleOnBackClick}>
                            Back
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleOnNextClick}
                            disabled={
                                (currentTab === 'seat' && selectedShowtimeSeats.length === 0) ||
                                currentTab === 'confirm'
                            }
                        >
                            {currentTab === 'payment' ? 'Confirm' : 'Next'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Page;
