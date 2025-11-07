import { ReactNode } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';

interface SortableHeaderProps<TData> {
    column: Column<TData, unknown> | undefined;
    children: ReactNode;
}

function SortableHeader<TData>({ column, children }: SortableHeaderProps<TData>) {
    return (
        <div
            className="flex items-center gap-1 group cursor-pointer"
            onClick={() => column?.toggleSorting(column?.getIsSorted() === 'asc')}
        >
            {children}
            <div className="px-1.5 py-1 group-hover:bg-slate-200 group-hover:text-black rounded-lg">
                <ArrowUpDown size={16} />
            </div>
        </div>
    );
}

export default SortableHeader;
