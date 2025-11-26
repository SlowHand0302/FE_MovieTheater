export interface CreateBookingResponse {
    bookingId: string;
    cinemaName: string;
    movieName: string;
    roomNumber: number;
    startTime: string; // or Date
    endTime: string; // or Date
    numberOfSeats: number;
    totalPrice: number;
    bookingSeats: BookingSeat[];
    bookingFoodDrinks: BookingFoodDrink[];
}

export interface BookingSeat {
    seatId: string;
    seatCode: string;
    seatType: string;
    label: string;
    price: number;
}

export interface BookingFoodDrink {
    foodDrinkId: string;
    name: string;
    type: string;
    size: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
