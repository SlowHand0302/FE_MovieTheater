'use client';

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

interface DataTableColFilterProps<TData, TValue extends string> {
    column: Column<TData, unknown> | undefined;
    variant: 'range' | 'single' | 'multiple';
    options: readonly TValue[];
}

export function DataTableColFilter<TData, TValue extends string>({
    column,
    variant,
    options,
}: DataTableColFilterProps<TData, TValue>) {
    const filterValue = column?.getFilterValue();

    const selectedSingle = (filterValue as string | undefined) ?? '';
    const selectedMultiple = (filterValue as string[] | undefined) ?? [];

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
                        options={options}
                    />
                )}
                {variant === 'multiple' && (
                    <MultipleFilterCol
                        multipleState={selectedMultiple}
                        options={options}
                        onChange={handleOnMultipleFilterOptionsChange}
                    />
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface SingleFilterColProps<TValue extends string> {
    radioState: string;
    onChange: (value: string) => void;
    options: readonly TValue[];
}

function SingleFilterCol<TValue extends string>({ radioState, onChange, options }: SingleFilterColProps<TValue>) {
    return (
        <DropdownMenuRadioGroup value={radioState} onValueChange={onChange}>
            <DropdownMenuRadioItem defaultChecked value="">
                All
            </DropdownMenuRadioItem>
            {options?.map((value, index) => {
                return (
                    <DropdownMenuRadioItem className="capitalize" key={index} value={value}>
                        {value}
                    </DropdownMenuRadioItem>
                );
            })}
        </DropdownMenuRadioGroup>
    );
}

interface MultipleFilterColProps<TValue extends string> {
    multipleState: string[];
    onChange: (value: string, checked: boolean) => void;
    options: readonly TValue[];
}

function MultipleFilterCol<TValue extends string>({
    options,
    multipleState,
    onChange,
}: MultipleFilterColProps<TValue>) {
    return (
        <>
            {options?.map((value, index) => {
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
