'use client';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    SortingState,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
} from '@tanstack/react-table';

import { CircleX, LoaderCircle, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MovieGenreForm from './components/MovieGenreForm';
import { useMovieGenreColumns } from './components/ColDef';
import { DataTable } from '@/components/data-table/DataTable';
import { MovieGenre } from '@/interfaces/MovieGenre.interface';
import { useConfirm } from '@/providers/ConfirmContext.provider';
import { dummyMovieGenres } from '@/features/movie-genre/constants/dummyData.constant';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';
import { useMovieGenres } from '@/features/movie-genre/queries';
import { useDeleteMovieGenre } from '@/features/movie-genre/mutations';
import { queryClient } from '@/lib/queryClient.config';

const Page = () => {
    const { data = [], isPending, isError } = useMovieGenres({});
    const { mutate: deleteGenre } = useDeleteMovieGenre();
    const genres = data as MovieGenre[];

    const confirm = useConfirm();
    const [selectedGenre, setSelectedGenre] = useState<MovieGenre>();
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useMovieGenreColumns({
        onEdit: handleEditGenre,
        onDelete: handleDeleteGenre,
    });

    const table = useReactTable({
        data: genres,
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

    function handleEditGenre(genre: MovieGenre) {
        setSelectedGenre(genre);
        setOpenFormDialog(true);
    }

    async function handleDeleteGenre(genre: MovieGenre) {
        const confirmed = await confirm({});
        if (confirmed) {
            deleteGenre(genre.id, {
                onSuccess: (res) => {
                    if (res) {
                        queryClient.invalidateQueries({ queryKey: ['genres'] });
                        toast.success('Delete movie genre successfully', { richColors: true });
                    }
                },
                onError: (error) => {
                    toast.error(error.message, { richColors: true });
                },
            });
        }
    }

    useEffect(() => {
        if (!openFormDialog) {
            setSelectedGenre(undefined);
        }
    }, [openFormDialog, setSelectedGenre]);

    if (isError) {
        return <div className="text-center py-10 text-gray-600">There are some error happened.</div>;
    }

    return (
        <>
            <main className="p-3">
                <section className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search Genre Name..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                            className="max-w-sm h-8"
                        />
                        {Object.keys(columnVisibility).length > 0 ? (
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
                            <Button variant="outline" size="sm" onClick={() => setOpenFormDialog(true)}>
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
                        <DataTable table={table} stickyHeader={true} />
                    )}
                    <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
                </section>
            </main>
            <MovieGenreForm genre={selectedGenre} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default Page;
