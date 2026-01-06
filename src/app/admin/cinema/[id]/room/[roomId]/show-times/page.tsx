'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useConfirm } from '@/providers/ConfirmContext.provider';
import { useShowTimeByRoom } from '@/features/show-time/queries';
import { ShowTimeByRoomResult } from '@/features/show-time/DTOs/GetShowTimes.dto';
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { useShowTimeColumns } from './components/ColDef';
import { Room, RoomStatus } from '@/interfaces/Room.interface';
import { CircleX, LoaderCircle, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTableColFilter } from '@/components/data-table/DataTableColFilter';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';
import { ShowTimeStatus } from '@/interfaces/Showtime.interface';
import { Button } from '@/components/ui/button';
import ShowtimeForm from './components/ShowtimeForm';
import DateRangePicker from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';

const ShowtimePage = () => {
    const router = useRouter();
    const confirm = useConfirm();

    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
    const [selectedShowtime, setSelectedShowtime] = useState<ShowTimeByRoomResult>();
    const [range, setRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const { id: cinemaId, roomId } = useParams<{ id: string; roomId: string }>();
    const {
        data: showtimeData,
        isPending: showtimePending,
        isError: showtimeError,
    } = useShowTimeByRoom({ roomId, From: range?.from?.toLocaleDateString(), To: range?.to?.toLocaleDateString() });
    const showTimes = showtimeData as ShowTimeByRoomResult[];

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useShowTimeColumns({
        onEdit: handleEditShowtime,
        onDelete: handleDeleteShowtime,
        onViewDetails(showtime) {
            router.push(`/admin/cinema/${cinemaId}/room/${roomId}`);
        },
    });
    const table = useReactTable({
        data: showTimes,
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

    function handleEditShowtime(showtime: ShowTimeByRoomResult) {}

    function handleDeleteShowtime(showtime: ShowTimeByRoomResult) {}

    if (showtimeError) return <div className="py-8 text-center text-destructive">Something wrong happened.</div>;

    return (
        <>
            <main className="p-3 space-y-2">
                {showtimePending ? (
                    <div className="text-center py-10 text-gray-600 w-full">
                        <LoaderCircle className="animate-spin text-5xl mx-auto" />
                    </div>
                ) : (
                    <section className="w-full space-y-2">
                        <div className="flex items-center gap-2">
                            <DataTableColFilter
                                column={table.getColumn('status')}
                                variant="multiple"
                                options={Object.values(ShowTimeStatus).map((item) => ({ label: item, value: item }))}
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
                            <DateRangePicker />
                            <div className="ml-auto flex gap-2 items-center">
                                <Button variant="outline" size="sm" onClick={() => setOpenFormDialog(true)}>
                                    <Plus />
                                    Create
                                </Button>
                                <DataTableViewOptions table={table} />
                            </div>
                        </div>
                        <DataTable table={table} stickyHeader={true} />
                        <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
                    </section>
                )}
            </main>
            <ShowtimeForm openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default ShowtimePage;
