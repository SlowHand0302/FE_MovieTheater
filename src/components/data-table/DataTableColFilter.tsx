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
import { FilterOption } from '@/types/FilterOption.type';

interface DataTableColFilterProps<TData> {
    column: Column<TData, unknown> | undefined;
    variant: 'range' | 'single' | 'multiple';
    options: readonly FilterOption[];
    label?: string;
}

export function DataTableColFilter<TData>({ column, variant, options, label }: DataTableColFilterProps<TData>) {
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
                    <FunnelPlus /> {label || column?.id}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel className="capitalize">{label || column?.id} Filter</DropdownMenuLabel>
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

interface SingleFilterColProps {
    radioState: string;
    onChange: (value: string) => void;
    options: readonly FilterOption[];
}

function SingleFilterCol({ radioState, onChange, options }: SingleFilterColProps) {
    return (
        <DropdownMenuRadioGroup value={radioState} onValueChange={onChange}>
            <DropdownMenuRadioItem defaultChecked value="">
                All
            </DropdownMenuRadioItem>
            {options?.map((option, index) => {
                return (
                    <DropdownMenuRadioItem className="capitalize" key={index} value={option.value}>
                        {option.label}
                    </DropdownMenuRadioItem>
                );
            })}
        </DropdownMenuRadioGroup>
    );
}

interface MultipleFilterColProps {
    multipleState: string[];
    onChange: (value: string, checked: boolean) => void;
    options: readonly FilterOption[];
}

function MultipleFilterCol({ options, multipleState, onChange }: MultipleFilterColProps) {
    return (
        <>
            {options?.map((option, index) => {
                return (
                    <DropdownMenuCheckboxItem
                        key={index}
                        checked={multipleState.includes(option.value)}
                        onCheckedChange={(checked) => onChange(option.value, checked)}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                );
            })}
        </>
    );
}
