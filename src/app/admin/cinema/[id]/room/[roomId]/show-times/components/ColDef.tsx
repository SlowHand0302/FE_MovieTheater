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
import ShowTimeBadge from './ShowTimeBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import SortableHeader from '@/components/data-table/SortableHeader';
import { Copy, FileText, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { ShowTimeStatus } from '@/interfaces/Showtime.interface';
import { ShowTimeByRoomResult } from '@/features/show-time/DTOs/GetShowTimes.dto';

interface useShowTimeColumnsParams {
    onCopyId: (id: string) => void;
    onViewDetails: (showtime: ShowTimeByRoomResult) => void;
    onEdit: (showtime: ShowTimeByRoomResult) => void;
    onDelete: (showtime: ShowTimeByRoomResult) => void;
}

export const useShowTimeColumns = ({
    onEdit,
    onViewDetails,
    onDelete,
    onCopyId,
}: Partial<useShowTimeColumnsParams> = {}) => {
    return useMemo<ColumnDef<ShowTimeByRoomResult, unknown>[]>(
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
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'showtimeId',
                header: ({ column }) => {
                    return <SortableHeader column={column}>ID</SortableHeader>;
                },
            },
            {
                accessorKey: 'movieName',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Movie</SortableHeader>;
                },
            },
            {
                accessorKey: 'startTime',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Start Time</SortableHeader>;
                },
                cell: ({ row }) => {
                    const showtime = row.original;
                    return <div>{new Date(showtime.startTime).toLocaleString()}</div>;
                },
            },
            {
                accessorKey: 'endTime',
                header: ({ column }) => {
                    return <SortableHeader column={column}>End Time</SortableHeader>;
                },
                cell: ({ row }) => {
                    const showtime = row.original;
                    return <div>{new Date(showtime.endTime).toLocaleString()}</div>;
                },
            },
            {
                accessorKey: 'status',
                header: () => {
                    return <div>Status</div>;
                },
                cell: ({ row }) => {
                    const state = row.getValue('status') as ShowTimeStatus;
                    return <ShowTimeBadge status={state} className="capitalize" />;
                },
                filterFn: (row, _, filterValue) => {
                    return filterValue.length === 0 ? row.original.status : filterValue.includes(row.original.status); // true or false based on your custom logic
                },
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const showtime = row.original;

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
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(showtime.showtimeId)}
                                    >
                                        <Copy />
                                        Copy ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onViewDetails && onViewDetails(showtime)}>
                                        <FileText /> View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => onEdit && onEdit(showtime)}>
                                        <SquarePen /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onDelete && onDelete(showtime)}>
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
