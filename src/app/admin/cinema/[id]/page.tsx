'use client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
} from '@tanstack/react-table';
import { CircleX, Plus } from 'lucide-react';
import RoomForm from './components/RoomForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTableColFilter } from '@/components/data-table/DataTableColFilter';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';

import { useRoomColumns } from './components/ColDef';
import { Room, RoomStatus } from '@/interfaces/Room.interface';
import { useConfirm } from '@/providers/ConfirmContext.provider';
import { dummyRooms } from '@/features/room/constants/dummyData.constant';
import { dummyRoomTypes } from '@/features/room-type/constants/dummyData.constant';

const Page = () => {
    const confirm = useConfirm();
    const router = useRouter();
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useRoomColumns({
        onEdit: handleEditRoom,
        onDelete: handleDeleteRoom,
        onViewDetails(cinema) {
            router.push(`/admin/cinema/${cinema.id}`);
        },
    });

    const table = useReactTable({
        data: dummyRooms,
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

    function handleEditRoom(room: Room) {
        setSelectedRoom(room);
        setOpenFormDialog(true);
    }

    async function handleDeleteRoom(room: Room) {
        const confirmed = await confirm({});
        if (confirmed) {
            toast.success('You submitted the following values:', {
                description: (
                    <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                        <code>{JSON.stringify(room, null, 2)}</code>
                    </pre>
                ),
                position: 'bottom-right',
                classNames: {
                    content: 'flex flex-col gap-2',
                },
                style: {
                    '--border-radius': 'calc(var(--radius)  + 4px)',
                } as React.CSSProperties,
                richColors: true,
            });
        }
    }

    useEffect(() => {
        if (!openFormDialog) {
            setSelectedRoom(undefined);
        }
    }, [openFormDialog, setSelectedRoom]);

    return (
        <>
            <main className="p-3">
                <section className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                        <DataTableColFilter
                            column={table.getColumn('status')}
                            variant="multiple"
                            options={Object.values(RoomStatus).map((item) => ({ label: item, value: item }))}
                        />
                        <DataTableColFilter
                            label="Type"
                            column={table.getColumn('roomTypeId')}
                            variant="multiple"
                            options={dummyRoomTypes.map((item) => ({ label: item.type, value: item.id }))}
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
                    <DataTable table={table} stickyHeader={true} />
                    <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
                </section>
            </main>
            <RoomForm room={selectedRoom} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default Page;
