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
import { MovieStatus } from '@/interfaces/Movie.interface';
import SortableHeader from '@/components/data-table/SortableHeader';
import { Copy, FileText, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import MovieBadge from './MovieBadge';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';

interface useMovieColumnsParams {
    onViewDetails: (Movie: MovieBaseResultData) => void;
    onEdit: (Movie: MovieBaseResultData) => void;
    onDelete: (Movie: MovieBaseResultData) => void;
}

export const useMovieColumns = ({ onEdit, onViewDetails, onDelete }: Partial<useMovieColumnsParams> = {}) => {
    return useMemo<ColumnDef<MovieBaseResultData, unknown>[]>(
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
                accessorKey: 'poster',
                header: () => {
                    return <div>Poster</div>;
                },
                cell: ({ row }) => {
                    return (
                        <div className="relative overflow-hidden rounded-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${row.original.poster}`}
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
                accessorKey: 'releaseDate',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Release Date</SortableHeader>;
                },
            },
            {
                accessorKey: 'duration',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Duration</SortableHeader>;
                },
            },
            {
                accessorKey: 'publisher',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Publisher</SortableHeader>;
                },
            },
            {
                accessorKey: 'country',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Country</SortableHeader>;
                },
            },
            {
                accessorKey: 'status',
                header: () => {
                    return <div>Status</div>;
                },
                cell: ({ row }) => {
                    const state = row.getValue('status') as MovieStatus;
                    return <MovieBadge status={state} />;
                },
                filterFn: (row, _, filterValue) => {
                    return filterValue.length === 0 ? row.original.status : filterValue.includes(row.original.status); // true or false based on your custom logic
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
