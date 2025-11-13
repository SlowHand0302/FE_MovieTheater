import { EditMode } from './SeatLayout';

interface EmptySeatProps {
    mode: EditMode;
    row: string;
    col: number;
    onClick: (row: string, col: number) => void;
}

const EmptySeat = ({ mode, row, col, onClick }: EmptySeatProps) => {
    return (
        <button
            onClick={() => onClick(row, col)}
            className={`w-8 h-8 rounded-lg border-2 border-dashed border-slate-600 transition-all ${
                mode === 'add' ? 'hover:bg-slate-700 hover:border-blue-400 cursor-pointer' : 'cursor-default'
            }`}
            title={mode === 'add' ? 'Click to add seat' : 'Empty'}
        />
    );
};

export default EmptySeat;
