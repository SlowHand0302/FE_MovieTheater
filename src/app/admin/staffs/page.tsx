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
import { DataTable } from '@/components/data-table/DataTable';
import { DataTableColFilter } from '@/components/data-table/DataTableColFilter';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';
import { useStaffColumns } from './components/ColDef';
import { useStaffProfiles } from '@/features/user/queries/staff.query';
import { Staff } from '@/interfaces/User.interface';
import StaffForm from './components/StaffForm';

const Page = () => {
    const { data: staffData = [], isPending, isError } = useStaffProfiles();
    const staffs = staffData as Staff[];

    const [selectedStaff, setSelectedStaff] = useState<Staff>();
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useStaffColumns({
        onEdit: handleEditCinema,
        onDelete: handleDeleteCinema,
        // onViewDetails(cinema) {
        //     router.push(`/admin/cinema/${cinema.id}`);
        // },
    });

    const table = useReactTable({
        data: staffs,
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

    function handleEditCinema(staff: Staff) {
        setSelectedStaff(staff);
        setOpenFormDialog(true);
    }

    async function handleDeleteCinema(staff: Staff) {}

    if (isError) {
        return <div className="text-center py-10 text-gray-600">There are some error happened.</div>;
    }

    return (
        <>
            <main className="p-3">
                <section className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search Staff Name..."
                            value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('fullName')?.setFilterValue(event.target.value)}
                            className="max-w-sm h-8"
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
                        <DataTable table={table} stickyHeader={true} />
                    )}
                    <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
                </section>
            </main>
            <StaffForm staff={selectedStaff} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default Page;
