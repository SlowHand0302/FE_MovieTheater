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
import RoomBadge from './RoomBadge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Room, RoomStatus } from '@/interfaces/Room.interface';
import SortableHeader from '@/components/data-table/SortableHeader';
import { Copy, FileText, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';

interface useRoomColumnsParams {
    onCopyId: (id: string) => void;
    onViewDetails: (room: Room) => void;
    onEdit: (room: Room) => void;
    onDelete: (room: Room) => void;
}

export const useRoomColumns = ({ onEdit, onViewDetails, onDelete, onCopyId }: Partial<useRoomColumnsParams> = {}) => {
    return useMemo<ColumnDef<Room, unknown>[]>(
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
                accessorKey: 'id',
                header: ({ column }) => {
                    return <SortableHeader column={column}>ID</SortableHeader>;
                },
            },
            {
                accessorKey: 'roomNumber',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Room Number</SortableHeader>;
                },
            },
            {
                accessorKey: 'roomTypeId',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Type</SortableHeader>;
                },
                cell: ({ row }) => {
                    const room = row.original;
                    return <div>{room.roomType}</div>;
                },
                filterFn: (row, _, filterValue) => {
                    return filterValue.length === 0
                        ? row.original.roomType
                        : filterValue.includes(row.original.roomType); // true or false based on your custom logic
                },
            },
            {
                accessorKey: 'status',
                header: () => {
                    return <div>Status</div>;
                },
                cell: ({ row }) => {
                    const state = row.getValue('status') as RoomStatus;
                    return <RoomBadge status={state} className="capitalize" />;
                },
                filterFn: (row, _, filterValue) => {
                    return filterValue.length === 0 ? row.original.status : filterValue.includes(row.original.status); // true or false based on your custom logic
                },
            },
            {
                id: 'layout',
                accessorFn: (row) => `${row.totalColumn} ${row.totalRow}`,
                header: () => {
                    return <div>Layout</div>;
                },
                cell: ({ row }) => {
                    const room = row.original;
                    return <div>{`${room.totalColumn} x ${room.totalRow}`}</div>;
                },
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const room = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 ">
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(room.id)}>
                                    <Copy />
                                    Copy ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => onViewDetails && onViewDetails(room)}>
                                    <FileText /> View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onEdit && onEdit(room)}>
                                    <SquarePen /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => onDelete && onDelete(room)}>
                                    <Trash2 /> Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [onEdit, onViewDetails, onDelete, onCopyId],
    );
};
