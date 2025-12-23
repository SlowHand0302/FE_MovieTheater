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

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SeatTypeForm from './components/SeatTypeForm';
import { useSeatTypeColumns } from './components/ColDef';
import { SeatType } from '@/interfaces/SeatType.interface';
import { CircleX, LoaderCircle, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/DataTable';
import { useConfirm } from '@/providers/ConfirmContext.provider';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';

import { queryClient } from '@/lib/queryClient.config';
import { useSeatTypes } from '@/features/seat-type/queries';
import { useDeleteSeatType } from '@/features/seat-type/mutations';

const Page = () => {
    const { data = [], isPending, isError } = useSeatTypes({});
    const { mutate: deleteSeatType } = useDeleteSeatType();
    const seatTypes = data as SeatType[];

    const confirm = useConfirm();
    const [selectedSeatType, setSelectedSeatType] = useState<SeatType>();
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useSeatTypeColumns({
        onEdit: handleEditSeatType,
        onDelete: handleDeleteSeatType,
    });

    const table = useReactTable({
        data: seatTypes,
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

    function handleEditSeatType(seatType: SeatType) {
        setSelectedSeatType(seatType);
        setOpenFormDialog(true);
    }

    async function handleDeleteSeatType(seatType: SeatType) {
        const confirmed = await confirm({});
        if (confirmed) {
            deleteSeatType(seatType.id, {
                onSuccess: (res) => {
                    if (res) {
                        queryClient.invalidateQueries({ queryKey: ['seat-types', {}] });
                        toast.success('Delete seat type successfully', { richColors: true });
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
            setSelectedSeatType(undefined);
        }
    }, [openFormDialog, setSelectedSeatType]);

    if (isError) {
        return <div className="text-center py-10 text-gray-600">There are some error happened.</div>;
    }

    return (
        <>
            <main className="p-3">
                <section className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search Room Type Name..."
                            value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('type')?.setFilterValue(event.target.value)}
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
            <SeatTypeForm seatType={selectedSeatType} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default Page;
