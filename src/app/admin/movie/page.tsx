'use client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
    SortingState,
    useReactTable,
    VisibilityState,
    getCoreRowModel,
    getSortedRowModel,
    ColumnFiltersState,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getFacetedUniqueValues,
    Row,
} from '@tanstack/react-table';

import { CircleX, LoaderCircle, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTableColFilter } from '@/components/data-table/DataTableColFilter';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';

import { queryClient } from '@/lib/queryClient.config';
import { useConfirm } from '@/providers/ConfirmContext.provider';
import { MovieStatus } from '@/interfaces/Movie.interface';
import { useMovieColumns } from './components/ColDef';
import { useMovieList } from '@/features/movie/queries';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';
import { useDeleteMovie } from '@/features/movie/mutations';

const Page = () => {
    const confirm = useConfirm();
    const router = useRouter();
    const { data = [], isPending } = useMovieList();
    const { mutate: deleteMovie } = useDeleteMovie();
    const movies = data as MovieBaseResultData[];

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useMovieColumns({
        onEdit: handleEditMovie,
        onDelete: handleDeleteMovie,
        onViewDetails(movie) {
            router.push(`/admin/movie/${movie.id}`);
        },
    });

    const table = useReactTable({
        data: movies,
        columns,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // for columns sorting
        getFilteredRowModel: getFilteredRowModel(), // for columns filtering
        getPaginationRowModel: getPaginationRowModel(), // for table pagination
        getFacetedRowModel: getFacetedRowModel(), // client-side faceting, must have this model to implement 2 funcs below
        getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
        // getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
        state: {
            sorting,
            rowSelection,
            columnFilters,
            columnVisibility,
        },
    });

    function handleEditMovie(movie: MovieBaseResultData) {
        router.push(`/admin/movie/edit/${movie.id}`);
    }

    function handleOnTableRowClick(row: Row<MovieBaseResultData>) {
        const movie = row.original;
        router.push(`/admin/movie/edit/${movie.id}`);
    }

    async function handleDeleteMovie(movie: MovieBaseResultData) {
        const confirmed = await confirm({});
        if (confirmed) {
            deleteMovie(movie.id, {
                onSuccess: (res) => {
                    if (res) {
                        toast.success(`Deleted cinema ${movie.name} successfully`, {
                            richColors: true,
                        });
                        queryClient.invalidateQueries({ queryKey: ['movie-list', {}] });
                    }
                },
                onError: (error) => {
                    toast.error(error.message, {
                        richColors: true,
                    });
                },
            });
        }
    }

    return (
        <main className="p-3">
            <section className="w-full space-y-2">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search Cinema Name..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                        className="max-w-sm h-8"
                    />
                    <DataTableColFilter
                        column={table.getColumn('status')}
                        variant="multiple"
                        options={Object.values(MovieStatus).map((item) => ({ label: item, value: item }))}
                    />
                    {columnFilters.length > 0 || Object.keys(columnVisibility).length > 0 ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden capitalize lg:flex"
                            onClick={() => {
                                table.resetColumnFilters(true);
                                table.resetColumnVisibility(true);
                            }}
                        >
                            <CircleX /> Reset
                        </Button>
                    ) : null}
                    <div className="ml-auto flex gap-2 items-center">
                        <Button variant="outline" size="sm" onClick={() => router.push('/admin/movie/create')}>
                            <Plus />
                            Create
                        </Button>
                        <DataTableViewOptions table={table} />
                    </div>
                </div>
                {isPending ? (
                    <div className="text-center py-10 text-gray-600 w-full">
                        <LoaderCircle className="animate-spin text-5xl mx-auto" />
                    </div>
                ) : (
                    <DataTable table={table} stickyHeader={true} onRowClick={handleOnTableRowClick} />
                )}
                <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
            </section>
        </main>
    );
};

export default Page;
