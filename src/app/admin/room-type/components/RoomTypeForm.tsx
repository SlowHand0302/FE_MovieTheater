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
import { useCreateRoomType, useUpdateRoomType } from '@/features/room-type/mutations';
import { queryClient } from '@/lib/queryClient.config';
import { LoaderCircle } from 'lucide-react';

const roomTypeFormSchema = z.object({
    type: z.string().nonempty('Room Type Name required'),
    extraPrice: z.number().nonnegative('The price must not be negative').gt(0, 'The price must larger than 0'),
});

interface RoomTypeFormProps {
    roomType?: RoomType;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const RoomTypeForm = ({ roomType, openForm, setOpenForm }: RoomTypeFormProps) => {
    const { mutate: createRoomType, isPending: createPending } = useCreateRoomType();
    const { mutate: updateRoomType, isPending: updatePending } = useUpdateRoomType();

    const form = useForm<z.infer<typeof roomTypeFormSchema>>({
        resolver: zodResolver(roomTypeFormSchema),
        defaultValues: {
            type: '',
            extraPrice: 0,
        },
    });

    const onSubmit = (data: z.infer<typeof roomTypeFormSchema>) => {
        if (roomType) {
            updateRoomType(
                { id: roomType.id, data },
                {
                    onSuccess: (res) => {
                        if (res) {
                            setOpenForm(false);
                            queryClient.invalidateQueries({ queryKey: ['room-types'] });
                            toast.success('Update room type successfully', { richColors: true });
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createRoomType(data, {
                onSuccess: (res) => {
                    if (res) {
                        setOpenForm(false);
                        queryClient.invalidateQueries({ queryKey: ['room-types'] });
                        toast.success('Create room type successfully', { richColors: true });
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
        const defaultValue = roomType ? { ...roomType } : { type: '', basePrice: 0 };
        form.reset(defaultValue);
    }, [roomType, form, openForm]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{roomType ? 'Edit this' : 'Create new'} room type</DialogTitle>
                    <DialogDescription>
                        {roomType ? 'Make changes to this room type' : 'Create new room type'} here. Click save when
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
                                    <FieldLabel htmlFor="room-type-base-price">Base Price</FieldLabel>
                                    <Input
                                        {...field}
                                        id="room-type-base-price"
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

export default RoomTypeForm;
