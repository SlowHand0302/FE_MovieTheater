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
import { Copy, FileText, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { FoodAndDrinkResultData } from '@/features/food-drink/DTOs/GetFoodAndDrink.dto';

interface useFoodDrinksColumnsParams {
    onViewDetails: (foodDrink: FoodAndDrinkResultData) => void;
    onEdit: (foodDrink: FoodAndDrinkResultData) => void;
    onDelete: (foodDrink: FoodAndDrinkResultData) => void;
}

export const useFoodDrinksColumns = ({ onEdit, onViewDetails, onDelete }: Partial<useFoodDrinksColumnsParams> = {}) => {
    return useMemo<ColumnDef<FoodAndDrinkResultData, unknown>[]>(
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
                accessorKey: 'image',
                header: () => {
                    return <></>;
                },
                cell: ({ row }) => {
                    return (
                        <div className="relative overflow-hidden rounded-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${row.original.image}`}
                                alt={row.original.name}
                                className="h-[60px] aspect-video object-cover rounded-md"
                            />
                        </div>
                    );
                },
                enableSorting: false,
                enableColumnFilter: false,
                enableGlobalFilter: false,
            },
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Name</SortableHeader>;
                },
                cell: ({ row }) => {
                    return <div className="max-w-sm line-clamp-1 truncate">{row.original.name}</div>;
                },
            },
            {
                accessorKey: 'type',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Type</SortableHeader>;
                },
            },
            {
                accessorKey: 'size',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Size</SortableHeader>;
                },
            },
            {
                accessorKey: 'price',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Price</SortableHeader>;
                },
            },
            {
                accessorKey: 'description',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Description</SortableHeader>;
                },
                cell: ({ row }) => {
                    return <div className="max-w-sm line-clamp-1 truncate">{row.original.description}</div>;
                },
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const Movie = row.original;

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
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(Movie.id)}>
                                        <Copy />
                                        Copy ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onViewDetails && onViewDetails(Movie)}>
                                        <FileText /> View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => onEdit && onEdit(Movie)}>
                                        <SquarePen /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onDelete && onDelete(Movie)}>
                                        <Trash2 /> Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [onEdit, onViewDetails, onDelete],
    );
};
