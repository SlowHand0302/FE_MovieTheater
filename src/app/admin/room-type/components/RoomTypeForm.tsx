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
import { RoomType } from '@/interfaces/RoomType.interface';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

const roomTypeFormSchema = z.object({
    type: z.string().nonempty('Room Type Name required'),
    basePrice: z.number().nonnegative('The price must not be negative').gt(0, 'The price must larger than 0'),
});

interface RoomTypeFormProps {
    roomType?: RoomType;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const RoomTypeForm = ({ roomType, openForm, setOpenForm }: RoomTypeFormProps) => {
    const form = useForm<z.infer<typeof roomTypeFormSchema>>({
        resolver: zodResolver(roomTypeFormSchema),
        defaultValues: {
            type: '',
            basePrice: 0,
        },
    });

    const onSubmit = (data: z.infer<typeof roomTypeFormSchema>) => {
        setOpenForm(false);
        toast.success('You submitted the following values:', {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: 'bottom-right',
            classNames: {
                content: 'flex flex-col gap-2',
            },
            style: {
                '--border-radius': 'calc(var(--radius)  + 4px)',
            } as React.CSSProperties,
            richColors: true,
        });
        form.reset();
    };

    useEffect(() => {
        if (!openForm) return;
        const defaultValue = roomType ? { ...roomType } : { type: '', basePrice: 0 };
        form.reset(defaultValue);
    }, [roomType, form, openForm]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{roomType ? 'Edit' : 'Create new'} Room Type</DialogTitle>
                    <DialogDescription>
                        {roomType ? 'Make changes to your Room Type' : 'Create new Room Type'} here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form id="form-room-type" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-3">
                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="room-type-name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="room-type-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="basePrice"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="room-type-base-price">Base Price</FieldLabel>
                                    <Input
                                        {...field}
                                        id="room-type-name"
                                        aria-invalid={fieldState.invalid}
                                        type="number"
                                        value={field.value === null ? '' : String(field.value)} // Handle null for display
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(value === '' ? null : Number(value)); // Convert to number or null
                                        }}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => form.reset()}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RoomTypeForm;
