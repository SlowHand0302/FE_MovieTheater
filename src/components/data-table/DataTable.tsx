'use client';

import { useEffect, useState } from 'react';
import { flexRender, Row, Table as TableType } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData> {
    table: TableType<TData>;
    stickyHeader?: boolean;
    onRowClick?: (row: Row<TData>) => void;
}

export function DataTable<TData>({ table, stickyHeader = false, onRowClick }: DataTableProps<TData>) {
    const [data, setData] = useState<TableType<TData> | null>(null);
    useEffect(() => {
        setData(table);
        return () => {
            setData(null);
        };
    }, [table]);

    if (!data) return null;

    return (
        <div className={`rounded-md border ${stickyHeader && '[&_>div]:max-h-[493px] [&_>div]:overflow-scroll'}`}>
            <Table>
                <TableHeader className={`${stickyHeader && 'sticky top-0 bg-white z-50'}`}>
                    {data.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {data.getRowModel().rows?.length ? (
                        data.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                onClick={() => onRowClick?.(row)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={data.getAllColumns().length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
