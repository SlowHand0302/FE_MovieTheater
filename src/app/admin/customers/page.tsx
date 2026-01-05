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

import { CircleX, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { useCustomerProfiles } from '@/features/user/queries/customer.query';
import User from '@/interfaces/User.interface';
import { useCustomerColumns } from './ColDef';

const Page = () => {
    const { data: customerData = [], isPending, isError } = useCustomerProfiles();
    const customers = customerData as User[];

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useCustomerColumns({});

    const table = useReactTable({
        data: customers,
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

    if (isError) {
        return <div className="text-center py-10 text-gray-600">There are some error happened.</div>;
    }

    return (
        <main className="p-3">
            <section className="w-full space-y-2">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search Customer Name..."
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
    );
};

export default Page;
