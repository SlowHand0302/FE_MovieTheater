'use client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    Row,
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
} from '@tanstack/react-table';

import { CircleX, LoaderCircle, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CinemaForm from './components/CinemaForm';
import { useCinemaColumns } from './components/ColDef';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTableColFilter } from '@/components/data-table/DataTableColFilter';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';

import { useCinemas } from '@/features/cinema/queries';
import { queryClient } from '@/lib/queryClient.config';
import { useDeleteCinema } from '@/features/cinema/mutations';
import { useConfirm } from '@/providers/ConfirmContext.provider';
import { Cinema, CinemaStatus } from '@/interfaces/Cinema.interface';

const Page = () => {
    const confirm = useConfirm();
    const router = useRouter();
    const { data = [], isPending, isError = true } = useCinemas({});
    const { mutate: deleteCinema } = useDeleteCinema();
    const cinemas = data as Cinema[];

    const [selectedCinema, setSelectedCinema] = useState<Cinema>();
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useCinemaColumns({
        onEdit: handleEditCinema,
        onDelete: handleDeleteCinema,
        onViewDetails(cinema) {
            router.push(`/admin/cinema/${cinema.id}`);
        },
    });

    const table = useReactTable({
        data: cinemas,
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

    function handleEditCinema(cinema: Cinema) {
        setSelectedCinema(cinema);
        setOpenFormDialog(true);
    }

    function handleOnTableRowClick(row: Row<Cinema>) {
        const cinema = row.original;
        router.push(`/admin/cinema/${cinema.id}`);
    }

    async function handleDeleteCinema(cinema: Cinema) {
        const confirmed = await confirm({});
        if (confirmed) {
            deleteCinema(cinema.id, {
                onSuccess: (res) => {
                    if (res) {
                        toast.success(`Deleted cinema ${cinema.name} successfully`, {
                            richColors: true,
                        });
                        queryClient.invalidateQueries({ queryKey: ['cinemas', {}] });
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

    useEffect(() => {
        if (!openFormDialog) {
            setSelectedCinema(undefined);
        }
    }, [openFormDialog, setSelectedCinema]);

    if (isError) {
        return <div className="text-center py-10 text-gray-600">There are some error happened.</div>;
    }

    return (
        <>
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
                            options={Object.values(CinemaStatus).map((item) => ({ label: item, value: item }))}
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
                        <DataTable table={table} stickyHeader={true} onRowClick={handleOnTableRowClick} />
                    )}
                    <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
                </section>
            </main>
            <CinemaForm cinema={selectedCinema} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default Page;
