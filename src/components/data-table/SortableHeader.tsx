import { ReactNode } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface SortableHeaderProps<TData> extends React.ComponentProps<'div'> {
    column: Column<TData, unknown> | undefined;
    children: ReactNode;
}

function SortableHeader<TData>({ column, children, className, ...props }: SortableHeaderProps<TData>) {
    return (
        <div
            {...props}
            className={cn('flex items-center gap-1 group cursor-pointer', className)}
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
