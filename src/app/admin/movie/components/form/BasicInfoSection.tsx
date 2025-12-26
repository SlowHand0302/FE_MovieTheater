import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { MovieFormData } from './MovieForm';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/DatePicker';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { TimePickerDemo } from '@/components/TimePicker';

const BasicInfoSection = () => {
    const form = useFormContext<MovieFormData>();

    return (
        <FieldGroup>
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                        <FieldLabel htmlFor="movie-name">Name</FieldLabel>
                        <Input
                            {...field}
                            id="movie-name"
                            aria-invalid={fieldState.invalid}
                            placeholder="Aa..."
                            autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                        <FieldLabel htmlFor="movie-description">Description</FieldLabel>
                        <Textarea
                            {...field}
                            id="movie-description"
                            aria-invalid={fieldState.invalid}
                            placeholder="Aa..."
                            autoComplete="off"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                <Controller
                    name="releaseDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1">
                            <FieldLabel htmlFor="movie-release-date">Release Date</FieldLabel>
                            <DatePicker selectedDate={field.value} setSelectedDate={field.onChange} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="duration"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-0">
                            <FieldLabel htmlFor="movie-duration">Duration</FieldLabel>
                            <TimePickerDemo date={field.value} setDate={field.onChange} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
        </FieldGroup>
    );
};

export default BasicInfoSection;
