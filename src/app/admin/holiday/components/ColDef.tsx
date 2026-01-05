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
import SortableHeader from '@/components/data-table/SortableHeader';
import { Copy, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { GetHolidaysDto } from '@/features/holiday/DTOs/GetHolidays.dto';

interface useHolidayColumnsParams {
    onCopyId: (id: string) => void;
    onEdit: (holiday: GetHolidaysDto) => void;
}

export const useHolidayColumns = ({ onEdit, onCopyId }: Partial<useHolidayColumnsParams> = {}) => {
    return useMemo<ColumnDef<GetHolidaysDto, unknown>[]>(
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
                accessorKey: 'name',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Name</SortableHeader>;
                },
            },
            {
                accessorKey: 'day_month',
                header: () => {
                    return <div>Date</div>;
                },
                cell: ({ row }) => {
                    const holiday = row.original;
                    return (
                        <div>
                            {holiday.day} / {holiday.month}
                        </div>
                    );
                },
                enableColumnFilter: false,
            },
            {
                accessorKey: 'extraPrice',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Extra Price</SortableHeader>;
                },
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const holiday = row.original;

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
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(holiday.id)}>
                                    <Copy />
                                    Copy ID
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onEdit && onEdit(holiday)}>
                                    <SquarePen /> Edit
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [onEdit, onCopyId],
    );
};
