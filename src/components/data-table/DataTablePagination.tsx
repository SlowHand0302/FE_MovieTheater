import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    pageSizes?: number[];
}

export function DataTablePagination<TData>({
    table,
    pageSizes = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
    const [data, setData] = useState<Table<TData> | null>(null);
    useEffect(() => {
        setData(table);
        return () => {
            setData(null);
        };
    }, [table]);
    if (!data) return null;
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                selected.
            </div>
            <div className="flex items-center space-x-0 gap-1 lg:space-x-8">
                <div className="sm:flex hidden items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
                                {table.getState().pagination.pageSize}
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Page Size</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={table.getState().pagination.pageSize.toLocaleString()}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                {pageSizes.map((pageSize, index) => {
                                    return (
                                        <DropdownMenuRadioItem
                                            key={index}
                                            className="capitalize"
                                            value={pageSize.toLocaleString()}
                                        >
                                            {pageSize}
                                        </DropdownMenuRadioItem>
                                    );
                                })}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Input
                        type="number"
                        min={1}
                        max={table.getPageCount()}
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            let page = e.target.value ? Number(e.target.value) - 1 : 0;
                            const maxPage = table.getPageCount() - 1;
                            // Ensure the page number stays within the allowed range
                            if (page < 0) page = 0;
                            if (page > maxPage) page = maxPage;

                            table.setPageIndex(page);
                        }}
                        className="h-8 w-8 p-0 text-center hideSpinButton"
                    />
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
