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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Cinema } from '@/interfaces/Cinema.interface';
import SortableHeader from '@/components/data-table/SortableHeader';
import { Copy, FileText, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
            },
            {
                accessorKey: 'status',
                header: () => {
                    return <div>Status</div>;
                },
                cell: ({ row }) => {
                    const state = row.getValue('status') as string;
                    switch (state) {
                        case 'active':
                            return <Badge className="bg-green-100 text-green-600">{state}</Badge>;
                        case 'inactive':
                            return <Badge variant="secondary">{state}</Badge>;
                        case 'closed':
                            return <Badge variant="destructive">{state}</Badge>;
                        case 'maintenance':
                            return <Badge className="bg-yellow-100 text-yellow-600">{state}</Badge>;
                        default:
                            return <Badge>{state}</Badge>;
                    }
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 ">
                                    <span className="sr-only">Open menu</span>
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
                                <DropdownMenuItem>
                                    <FileText /> View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onEdit && onEdit(cinema)}>
                                    <SquarePen /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
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
