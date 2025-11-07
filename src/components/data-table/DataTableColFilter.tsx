'use client';
import { useMemo } from 'react';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FunnelPlus } from 'lucide-react';
import { Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

interface DataTableColFilterProps<TData> {
    column: Column<TData, unknown> | undefined;
    variant: 'range' | 'single' | 'multiple';
}

export function DataTableColFilter<TData>({ column, variant }: DataTableColFilterProps<TData>) {
    const filterValue = column?.getFilterValue();

    const selectedSingle = (filterValue as string | undefined) ?? '';
    const selectedMultiple = (filterValue as string[] | undefined) ?? [];

    const sortedUniqueValues = useMemo(() => {
        if (!column || variant === 'range') return [];

        const map = column.getFacetedUniqueValues(); // Map<unknown, number>
        return Array.from(map.keys())
            .filter((v): v is string => typeof v === 'string')
            .sort();
    }, [column, variant]);

    const handleSingleFilterOptionsChange = (value: string) => {
        column?.setFilterValue(value || undefined);
    };

    const handleOnMultipleFilterOptionsChange = (value: string, checked: boolean) => {
        const current = (column?.getFilterValue() as string[] | undefined) ?? [];
        const newValue = checked ? [...current.filter((v) => v !== value), value] : current.filter((v) => v !== value);

        column?.setFilterValue(newValue.length ? newValue : undefined);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden capitalize lg:flex">
                    <FunnelPlus /> {column?.id}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel className="capitalize">{column?.id} Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {variant === 'single' && (
                    <SingleFilterCol
                        radioState={selectedSingle}
                        onChange={handleSingleFilterOptionsChange}
                        content={sortedUniqueValues}
                    />
                )}
                {variant === 'multiple' && (
                    <MultipleFilterCol
                        multipleState={selectedMultiple}
                        content={sortedUniqueValues}
                        onChange={handleOnMultipleFilterOptionsChange}
                    />
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface SingleFilterColProps {
    radioState: string;
    onChange: (value: string) => void;
    content: string[];
}

function SingleFilterCol({ radioState, onChange, content }: SingleFilterColProps) {
    return (
        <DropdownMenuRadioGroup value={radioState} onValueChange={onChange}>
            <DropdownMenuRadioItem defaultChecked value="">
                All
            </DropdownMenuRadioItem>
            {content?.map((value, index) => {
                return (
                    <DropdownMenuRadioItem className="capitalize" key={index} value={value}>
                        {value}
                    </DropdownMenuRadioItem>
                );
            })}
        </DropdownMenuRadioGroup>
    );
}

interface MultipleFilterColProps {
    multipleState: string[];
    onChange: (value: string, checked: boolean) => void;
    content: string[];
}

function MultipleFilterCol({ content, multipleState, onChange }: MultipleFilterColProps) {
    return (
        <>
            {content?.map((value, index) => {
                return (
                    <DropdownMenuCheckboxItem
                        key={index}
                        checked={multipleState.includes(value)}
                        onCheckedChange={(checked) => onChange(value, checked)}
                    >
                        {value}
                    </DropdownMenuCheckboxItem>
                );
            })}
        </>
    );
}
