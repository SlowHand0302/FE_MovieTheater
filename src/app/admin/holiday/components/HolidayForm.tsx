'use client';
import * as z from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { queryClient } from '@/lib/queryClient.config';
import { LoaderCircle } from 'lucide-react';
import { GetHolidaysDto } from '@/features/holiday/DTOs/GetHolidays.dto';
import { useCreateHoliday, useUpdateHoliday } from '@/features/holiday/mutations';

const holidayFormSchema = z.object({
    name: z.string().nonempty('Name required'),
    day: z.number().gt(0, 'Day must not be 0 or negative').max(31, 'Day must not be larger than 31'),
    month: z.number().gt(0, 'Month must not be 0 or negative').max(12, 'Month must not be larger than 31'),
    extraPrice: z.number().nonnegative('The price must not be negative').gt(0, 'The price must larger than 0'),
});

interface HolidayFormProps {
    holiday?: GetHolidaysDto;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const HolidayForm = ({ holiday, openForm, setOpenForm }: HolidayFormProps) => {
    const { mutate: createHoliday, isPending: createPending } = useCreateHoliday();
    const { mutate: updateHoliday, isPending: updatePending } = useUpdateHoliday();

    const form = useForm<z.infer<typeof holidayFormSchema>>({
        resolver: zodResolver(holidayFormSchema),
        defaultValues: {
            name: '',
            day: 1,
            month: 1,
            extraPrice: 0,
        },
    });

    const onSubmit = (data: z.infer<typeof holidayFormSchema>) => {
        if (holiday) {
            updateHoliday(
                { id: holiday.id, data },
                {
                    onSuccess: (res) => {
                        if (res) {
                            setOpenForm(false);
                            queryClient.invalidateQueries({ queryKey: ['holidays'] });
                            toast.success('Update holiday successfully', { richColors: true });
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createHoliday(data, {
                onSuccess: (res) => {
                    if (res) {
                        setOpenForm(false);
                        queryClient.invalidateQueries({ queryKey: ['holidays'] });
                        toast.success('Create holiday successfully', { richColors: true });
                        form.reset();
                    }
                },
                onError: (error) => {
                    toast.error(error.message, { richColors: true });
                },
            });
        }
    };

    useEffect(() => {
        if (!openForm) return;
        const defaultValue = holiday ? { ...holiday } : { name: '', day: 1, month: 1, extraPrice: 0 };
        form.reset(defaultValue);
    }, [holiday, form, openForm]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{holiday ? 'Edit this' : 'Create new'} holiday</DialogTitle>
                    <DialogDescription>
                        {holiday ? 'Make changes to this holiday' : 'Create new holiday'} here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form id="form-holiday" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-3">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="holiday-name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="holiday-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                        disabled={createPending || updatePending}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="day"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="holiday-day">Day</FieldLabel>
                                        <Input
                                            {...field}
                                            id="holiday-day"
                                            aria-invalid={fieldState.invalid}
                                            type="number"
                                            value={field.value === null ? '' : String(field.value)} // Handle null for display
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === '' ? null : Number(value)); // Convert to number or null
                                            }}
                                            disabled={createPending || updatePending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="month"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="holiday-month">Month</FieldLabel>
                                        <Input
                                            {...field}
                                            id="holiday-month"
                                            aria-invalid={fieldState.invalid}
                                            type="number"
                                            value={field.value === null ? '' : String(field.value)} // Handle null for display
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === '' ? null : Number(value)); // Convert to number or null
                                            }}
                                            disabled={createPending || updatePending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <Controller
                            name="extraPrice"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="holiday-extraPrice">Extra Price</FieldLabel>
                                    <Input
                                        {...field}
                                        id="holiday-extraPrice"
                                        aria-invalid={fieldState.invalid}
                                        type="number"
                                        value={field.value === null ? '' : String(field.value)} // Handle null for display
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === '' ? null : Number(value)); // Convert to number or null
                                        }}
                                        disabled={createPending || updatePending}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    disabled={createPending || updatePending}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {(updatePending || createPending) && <LoaderCircle className="animate-spin" />}
                                {updatePending
                                    ? 'Processing Updating...'
                                    : createPending
                                      ? 'Processing Creating...'
                                      : 'Save Changes'}{' '}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default HolidayForm;
