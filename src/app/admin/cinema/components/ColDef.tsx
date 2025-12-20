'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CinemaBadge from './CinemaBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Cinema, CinemaStatus } from '@/interfaces/Cinema.interface';
import SortableHeader from '@/components/data-table/SortableHeader';
import { Copy, FileText, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';

interface useCinemaColumnsParams {
    onCopyId: (id: string) => void;
    onViewDetails: (cinema: Cinema) => void;
    onEdit: (cinema: Cinema) => void;
    onDelete: (cinema: Cinema) => void;
}

export const useCinemaColumns = ({
    onEdit,
    onViewDetails,
    onDelete,
    onCopyId,
}: Partial<useCinemaColumnsParams> = {}) => {
    return useMemo<ColumnDef<Cinema, unknown>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Name</SortableHeader>;
                },
            },
            {
                accessorKey: 'address',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Address</SortableHeader>;
                },
                cell: ({ row }) => {
                    return <div className="max-w-sm line-clamp-1 truncate">{row.original.address}</div>;
                },
            },
            {
                accessorKey: 'city',
                header: ({ column }) => {
                    return <SortableHeader column={column}>City</SortableHeader>;
                },
            },
            {
                accessorKey: 'status',
                header: () => {
                    return <div>Status</div>;
                },
                cell: ({ row }) => {
                    const state = row.getValue('status') as CinemaStatus;
                    return <CinemaBadge status={state} />;
                },
                filterFn: (row, _, filterValue) => {
                    return filterValue.length === 0 ? row.original.status : filterValue.includes(row.original.status); // true or false based on your custom logic
                },
            },
            {
                accessorKey: 'open_Time',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Open Time</SortableHeader>;
                },
            },
            {
                accessorKey: 'close_Time',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Close Time</SortableHeader>;
                },
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const cinema = row.original;

                    return (
                        <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 ">
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cinema.id)}>
                                        <Copy />
                                        Copy ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onViewDetails && onViewDetails(cinema)}>
                                        <FileText /> View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => onEdit && onEdit(cinema)}>
                                        <SquarePen /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onDelete && onDelete(cinema)}>
                                        <Trash2 /> Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [onEdit, onViewDetails, onDelete, onCopyId],
    );
};
