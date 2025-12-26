'use client';
import React from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';

import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

import { MovieFormData } from './MovieForm';
import { Person } from '@/interfaces/Person.interface';
import { useMoviePersons } from '@/features/movie/queries';
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';

export default function CastCrewSection() {
    const { data = [] } = useMoviePersons({});
    const personOptions = (data as Person[]).map((p) => ({ label: p.fullName, value: p.id }));

    const { control } = useFormContext<MovieFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'persons',
    });

    return (
        <Controller
            control={control}
            name="persons"
            render={({ fieldState }) => {
                return (
                    <Field className="gap-2 pt-1" data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-sm font-medium" htmlFor="movie-persons">
                            Cast & Crew
                        </FieldLabel>
                        <FieldSet className="gap-2">
                            {fields.map((person, index) => {
                                return (
                                    <div key={person.id} className="flex gap-3 items-start">
                                        <Controller
                                            control={control}
                                            name={`persons.${index}.personId`}
                                            render={({ field: personField, fieldState }) => {
                                                return (
                                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                                        <Select
                                                            value={personField.value}
                                                            onValueChange={personField.onChange}
                                                        >
                                                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                                                <SelectValue placeholder="Select person..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {personOptions.map((opt) => (
                                                                    <SelectItem key={opt.value} value={opt.value}>
                                                                        {opt.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                );
                                            }}
                                        />

                                        <Controller
                                            control={control}
                                            name={`persons.${index}.role`}
                                            render={({ field: roleField, fieldState }) => {
                                                return (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <Input
                                                            {...roleField}
                                                            placeholder="Role (e.g., Actor, Director)"
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                );
                                            }}
                                        />

                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </FieldSet>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            id="movie-persons"
                            onClick={() => {
                                append({ personId: '', role: '' });
                            }}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Person
                        </Button>
                    </Field>
                );
            }}
        />
    );
}
