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
import { MovieGenre } from '@/interfaces/MovieGenre.interface';
import SortableHeader from '@/components/data-table/SortableHeader';
import { Copy, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';

interface useMovieGenreColumnsParams {
    onCopyId: (id: string) => void;
    onEdit: (genre: MovieGenre) => void;
    onDelete: (genre: MovieGenre) => void;
}

export const useMovieGenreColumns = ({ onEdit, onDelete, onCopyId }: Partial<useMovieGenreColumnsParams> = {}) => {
    return useMemo<ColumnDef<MovieGenre, unknown>[]>(
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
                accessorKey: 'createdAt',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Created At</SortableHeader>;
                },
                cell: ({ row }) => {
                    const genre = row.original;
                    const formattedDate = new Date(genre.createdAt).toLocaleDateString('vi-VN');
                    return <div>{formattedDate}</div>;
                },
            },
            {
                accessorKey: 'updatedAt',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Updated At</SortableHeader>;
                },
                cell: ({ row }) => {
                    const genre = row.original;
                    const formattedDate = new Date(genre.updatedAt).toLocaleDateString('vi-VN');
                    return <div>{formattedDate}</div>;
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
                                <DropdownMenuItem onSelect={() => onEdit && onEdit(cinema)}>
                                    <SquarePen /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => onDelete && onDelete(cinema)}>
                                    <Trash2 /> Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [onEdit, onDelete, onCopyId],
    );
};
