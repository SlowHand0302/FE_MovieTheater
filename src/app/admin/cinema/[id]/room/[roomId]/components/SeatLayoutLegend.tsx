import { SeatType } from '@/interfaces/SeatType.interface';

const SeatLayoutLegend = ({ types }: { types: SeatType[] }) => {
    return (
        <div className="flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-slate-700">
            {types.map((type) => {
                let color = '';
                switch (type.id) {
                    case 'st-001':
                        color = 'bg-blue-400';
                        break;
                    case 'st-002':
                        color = 'bg-purple-400';
                        break;
                    case 'st-003':
                        color = 'bg-yellow-400';
                        break;
                    case 'st-004':
                        color = 'bg-pink-400';
                        break;
                    case 'st-005':
                        color = 'bg-orange-400';
                        break;
                    default:
                        break;
                }
                return (
                    <div key={type.id} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-sm ${color}`} />
                        <span className="text-sm ">{type.type}</span>
                    </div>
                );
            })}
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-sm" />
                <span className="text-sm ">Selected</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded-sm opacity-50" />
                <span className="text-sm ">Inactive</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-dashed border-slate-600 rounded-sm" />
                <span className="text-sm ">Empty</span>
            </div>
        </div>
    );
};

export default SeatLayoutLegend;
