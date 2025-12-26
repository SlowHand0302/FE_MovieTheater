'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';

import { cn } from '@/lib/utils';
import { MovieFormData } from './MovieForm';
import { useMovieGenres } from '@/features/movie-genre/queries';
import { Field, FieldLabel } from '@/components/ui/field';
import { MovieGenre } from '@/interfaces/MovieGenre.interface';

export default function GenresSection() {
    const { control, watch, setValue } = useFormContext<MovieFormData>();
    const genres = watch('genres');

    const { data = [], isPending, isError, error } = useMovieGenres({});
    const options = (data as MovieGenre[]).map((g) => ({ label: g.name, value: g.id }));

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

    const toggleGenre = (value: string) => {
        const exists = genres.some((g) => g.genreId === value);
        if (exists) {
            setValue(
                'genres',
                genres.filter((g) => g.genreId !== value),
                { shouldValidate: true },
            );
        } else {
            setValue('genres', [...genres, { genreId: value }], { shouldValidate: true });
        }
    };

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>{error.message}</div>;

    return (
        Array.isArray(genres) && (
            <Controller
                name="genres"
                control={control}
                render={({ fieldState }) => (
                    <Field className="pt-1 gap-1" data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-sm font-medium">Genres</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        'w-full justify-between h-auto flex-wrap gap-2 ',
                                        genres.length > 0 && 'hover:bg-transparent',
                                    )}
                                    aria-invalid={fieldState.invalid}
                                >
                                    {genres.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {genres.map((g) => {
                                                const opt = options.find((o) => o.value === g.genreId);
                                                return (
                                                    <Badge
                                                        key={g.genreId}
                                                        variant="secondary"
                                                        className="cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleGenre(g.genreId);
                                                        }}
                                                    >
                                                        {opt?.label} <span className="ml-1">✕</span>
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground font-normal">Select genres...</span>
                                    )}
                                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Search genres..."
                                        value={search}
                                        onValueChange={setSearch}
                                    />
                                    <CommandEmpty>No genre found.</CommandEmpty>
                                    <CommandGroup className="max-h-64 overflow-auto">
                                        {filtered.map((opt) => (
                                            <CommandItem key={opt.value} onSelect={() => toggleGenre(opt.value)}>
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        genres.some((g) => g.genreId === opt.value)
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                                {opt.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {fieldState.invalid && <p className="text-sm text-destructive">{fieldState.error?.message}</p>}
                    </Field>
                )}
            />
        )
    );
}
