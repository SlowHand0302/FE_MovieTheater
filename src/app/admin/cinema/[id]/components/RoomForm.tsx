import * as z from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

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
import { FieldGroup, Field, FieldLabel, FieldError, FieldContent } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Room, RoomStatus } from '@/interfaces/Room.interface';
import { dummyRoomTypes } from '@/features/room-type/constants/dummyData.constant';

const roomFormSchema = z.object({
    roomNumber: z
        .number()
        .nonnegative('The room number must not be negative')
        .gt(0, 'The room number must be larger than 0'),
    status: z.string().nonempty('Status required'),
    cinemaId: z.string().nonempty('Cinema required'),
    roomTypeId: z.string().nonempty('Room Type required'),
    total_Column: z
        .number()
        .nonnegative('The number of column must not be negative')
        .gt(0, 'The room number must be larger than 0'),
    total_Row: z
        .number()
        .nonnegative('The number of row must not be negative')
        .gt(0, 'The room number must be larger than 0'),
});

interface RoomFormProps {
    room?: Room;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const RoomForm = ({ room, openForm, setOpenForm }: RoomFormProps) => {
    const dynamicParams = useParams();
    const roomTypes = dummyRoomTypes.map((type) => ({
        label: type.type,
        value: type.id,
    }));

    const form = useForm<z.infer<typeof roomFormSchema>>({
        resolver: zodResolver(roomFormSchema),
        defaultValues: {
            roomNumber: 0,
            status: '',
            cinemaId: dynamicParams.id?.toString(),
            roomTypeId: '',
            total_Column: 0,
            total_Row: 0,
        },
    });

    const onSubmit = (data: z.infer<typeof roomFormSchema>) => {
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
        const defaultVal = room
            ? { ...room }
            : {
                  roomNumber: 0,
                  status: '',
                  cinemaId: dynamicParams.id?.toString(),
                  roomTypeId: '',
                  total_Column: 0,
                  total_Row: 0,
              };
        form.reset(defaultVal);
    }, [room, openForm, form]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="max-w-[90vw] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{room ? 'Edit this' : 'Create new'} room</DialogTitle>
                    <DialogDescription>
                        {room ? 'Make changes to this room' : 'Create new room'} here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="form-room"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="overflow-y-scroll p-1 max-h-[70vh] relative"
                >
                    <FieldGroup className="gap-3">
                        <Controller
                            name="roomNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="room-room-number">Base Price</FieldLabel>
                                    <Input
                                        {...field}
                                        id="room-room-number"
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
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldContent>
                                        <FieldLabel htmlFor="room-status">Status</FieldLabel>
                                    </FieldContent>
                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                            id="room-status"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-[120px] capitalize"
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned" align="end">
                                            {Object.entries(RoomStatus).map(([key, value]) => (
                                                <SelectItem key={key} value={value} className="capitalize">
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="roomTypeId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldContent>
                                        <FieldLabel htmlFor="room-type">Type</FieldLabel>
                                    </FieldContent>
                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                            id="room-type"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-[120px] capitalize"
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned" align="end">
                                            {roomTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value} className="capitalize">
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="total_Column"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="room-total-column">Total Columns</FieldLabel>
                                        <Input
                                            {...field}
                                            id="room-total-column"
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
                            <Controller
                                name="total_Row"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="room-total-row">Total Rows</FieldLabel>
                                        <Input
                                            {...field}
                                            id="room-total-row"
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
                        </div>
                        <DialogFooter className="sticky bottom-0 bg-background">
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

export default RoomForm;
