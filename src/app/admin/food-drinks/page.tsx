'use client';
import React, { useEffect, useState } from 'react';
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

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CircleX, LoaderCircle, Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table/DataTable';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableViewOptions } from '@/components/data-table/DataTableViewOptions';

import FoodDrinkForm from './components/FoodDrinkForm';
import { useFoodDrinksColumns } from './components/ColDef';
import { useConfirm } from '@/providers/ConfirmContext.provider';
import { useFoodAndDrinkList } from '@/features/food-drink/queries';
import { FoodAndDrinkResultData } from '@/features/food-drink/DTOs/GetFoodAndDrink.dto';
import { useDeleteFoodDrink } from '@/features/food-drink/mutations';
import { queryClient } from '@/lib/queryClient.config';
import { toast } from 'sonner';

const Page = () => {
    const confirm = useConfirm();

    const [selectedFoodDrink, setSelectedFoodDrink] = useState<FoodAndDrinkResultData>();
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useFoodDrinksColumns({
        onDelete: handleDeleteCinema,
        onEdit: handleEditCinema,
        onViewDetails(foodDrink) {
            setSelectedFoodDrink(foodDrink);
            setOpenFormDialog(true);
        },
    });

    const { mutate: deleteFoodDrink } = useDeleteFoodDrink();
    const { data: foodDrinkData = [], isPending: foodDrinkPending, isError: foodDrinkError } = useFoodAndDrinkList();
    const foodDrinks = foodDrinkData as FoodAndDrinkResultData[];

    const table = useReactTable({
        data: foodDrinks,
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

    function handleEditCinema(foodDrink: FoodAndDrinkResultData) {
        setSelectedFoodDrink(foodDrink);
        setOpenFormDialog(true);
    }

    async function handleDeleteCinema(foodDrink: FoodAndDrinkResultData) {
        const confirmed = await confirm({});
        if (confirmed) {
            deleteFoodDrink(foodDrink.id, {
                onSuccess: (res) => {
                    if (res) {
                        toast.success(`Deleted cinema ${foodDrink.name} successfully`, {
                            richColors: true,
                        });
                        queryClient.invalidateQueries({ queryKey: ['foods-and-drinks'] });
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

    function handleOnRowTableClick(row: Row<FoodAndDrinkResultData>) {
        const foodDrink = row.original;
        setSelectedFoodDrink(foodDrink);
        setOpenFormDialog(true);
    }

    useEffect(() => {
        if (!openFormDialog) {
            setSelectedFoodDrink(undefined);
        }
    }, [openFormDialog, setSelectedFoodDrink]);

    if (foodDrinkError) {
        return <div className="text-center py-10 text-gray-600">There are some error happened.</div>;
    }

    return (
        <>
            <main className="p-3">
                <section className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search Food or Drink Name..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
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
                    {foodDrinkPending ? (
                        <div className="text-center py-10 text-gray-600 w-full">
                            <LoaderCircle className="animate-spin text-5xl mx-auto" />
                        </div>
                    ) : (
                        <DataTable table={table} stickyHeader={true} onRowClick={handleOnRowTableClick} />
                    )}
                    <DataTablePagination table={table} pageSizes={[10, 20, 30, 40, 50]} />
                </section>
            </main>
            <FoodDrinkForm foodDrinks={selectedFoodDrink} openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default Page;
