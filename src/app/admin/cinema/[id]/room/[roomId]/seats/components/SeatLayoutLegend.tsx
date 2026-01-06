import { SeatType } from '@/interfaces/SeatType.interface';

const SeatLayoutLegend = ({ types }: { types: SeatType[] }) => {
    return (
        <div className="flex flex-wrap justify-center gap-6 pt-6 mt-6 border-t border-slate-700">
            {types.map((type) => {
                let color: string = '';
                switch (type.type.toLowerCase()) {
                    case 'standard':
                        color = 'bg-blue-400 hover:bg-blue-500';
                        break;
                    case 'premium':
                        color = 'bg-purple-400 hover:bg-purple-500';
                        break;
                    case 'recliner':
                        color = 'bg-yellow-400 hover:bg-yellow-500';
                        break;
                    case 'vip sofa':
                        color = 'bg-pink-400 hover:bg-pink-500';
                        break;
                    case 'loveseat':
                        color = 'bg-orange-400 hover:bg-orange-500';
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
