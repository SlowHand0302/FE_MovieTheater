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
import { SeatType } from '@/interfaces/SeatType.interface';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { queryClient } from '@/lib/queryClient.config';
import { useCreateSeatType, useUpdateSeatType } from '@/features/seat-type/mutations';
import { LoaderCircle } from 'lucide-react';

const seatTypeFormSchema = z.object({
    type: z.string().nonempty('Seat Type Name required'),
    extraPrice: z.number().nonnegative('The price must not be negative').gt(0, 'The price must larger than 0'),
});

interface SeatTypeFormProps {
    seatType?: SeatType;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const SeatTypeForm = ({ seatType, openForm, setOpenForm }: SeatTypeFormProps) => {
    const { mutate: createSeatType, isPending: createPending } = useCreateSeatType();
    const { mutate: updateSeatType, isPending: updatePending } = useUpdateSeatType();

    const form = useForm<z.infer<typeof seatTypeFormSchema>>({
        resolver: zodResolver(seatTypeFormSchema),
        defaultValues: {
            type: '',
            extraPrice: 0,
        },
    });

    const onSubmit = (data: z.infer<typeof seatTypeFormSchema>) => {
        if (seatType) {
            updateSeatType(
                { id: seatType.id, data },
                {
                    onSuccess: (res) => {
                        if (res) {
                            setOpenForm(false);
                            queryClient.invalidateQueries({ queryKey: ['seat-types', {}] });
                            toast.success('Create seat type successfully', { richColors: true });
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createSeatType(data, {
                onSuccess: (res) => {
                    if (res) {
                        setOpenForm(false);
                        queryClient.invalidateQueries({ queryKey: ['seat-types', {}] });
                        toast.success('Create seat type successfully', { richColors: true });
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
        const defaultValue = seatType ? { ...seatType } : { type: '', extraPrice: 0 };
        form.reset(defaultValue);
    }, [seatType, form, openForm]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{seatType ? 'Edit this' : 'Create new'} seat type</DialogTitle>
                    <DialogDescription>
                        {seatType ? 'Make changes to this seat type' : 'Create new seat type'} here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form id="form-seat-type" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-3">
                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="seat-type-name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="seat-type-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                        disabled={createPending || updatePending}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="extraPrice"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="seat-type-extra-price">Extra Price</FieldLabel>
                                    <Input
                                        {...field}
                                        id="seat-type-extra-price"
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
                            <Button type="submit" disabled={createPending || updatePending}>
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

export default SeatTypeForm;
