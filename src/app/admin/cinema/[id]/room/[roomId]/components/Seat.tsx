import { Seat as ISeat } from '@/interfaces/Seat.interface';

const Seat = ({ seat, onClick, seatColor }: { seat: ISeat; onClick: (seat: ISeat) => void; seatColor: string }) => {
    return (
        <button
            onClick={() => onClick(seat)}
            className={`w-8 h-8 rounded-lg transition-all transform hover:scale-110 cursor-pointer ${seatColor}`}
            title={`${seat.seatCode} - ${seat.seatTypeId} - ${seat.isActive ? 'Active' : 'Inactive'}`}
        >
            <span className="text-xs font-semibold ">{seat.displayNumber}</span>
        </button>
    );
};

export default Seat;
