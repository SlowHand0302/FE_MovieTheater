import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { MovieFormData } from './MovieForm';
import { MovieStatus } from '@/interfaces/Movie.interface';

const ProductionInfoSection = () => {
    const form = useFormContext<MovieFormData>();

    return (
        <FieldGroup>
            <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                <Controller
                    name="publisher"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1">
                            <FieldLabel htmlFor="movie-publisher">Publisher</FieldLabel>
                            <Input
                                {...field}
                                id="movie-publisher"
                                aria-invalid={fieldState.invalid}
                                placeholder="Aa..."
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="country"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1">
                            <FieldLabel htmlFor="movie-country">Country</FieldLabel>
                            <Input
                                {...field}
                                id="movie-country"
                                aria-invalid={fieldState.invalid}
                                placeholder="Aa..."
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <Controller
                name="trailerUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                        <FieldLabel htmlFor="movie-trailer-url">Trailer URL</FieldLabel>
                        <Input
                            {...field}
                            id="movie-trailer-url"
                            aria-invalid={fieldState.invalid}
                            placeholder="https://youtube.com/watch?v=..."
                            autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => {
                        return (
                            <Field data-invalid={fieldState.invalid} className="gap-1">
                                <FieldLabel htmlFor="movie-status">Status</FieldLabel>
                                <Select {...field} defaultValue={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        id="movie-status"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-[120px] capitalize"
                                    >
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned" align="end">
                                        {Object.entries(MovieStatus).map(([key, value]) => (
                                            <SelectItem key={key} value={value} className="capitalize">
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />
                <Controller
                    name="language"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1">
                            <FieldLabel htmlFor="movie-language">Language</FieldLabel>
                            <Input
                                {...field}
                                id="movie-language"
                                aria-invalid={fieldState.invalid}
                                placeholder="Aa..."
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
        </FieldGroup>
    );
};

export default ProductionInfoSection;
