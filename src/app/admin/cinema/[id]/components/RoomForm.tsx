import * as z from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FieldErrors, useForm } from 'react-hook-form';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FieldGroup, Field, FieldLabel, FieldError, FieldContent } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { queryClient } from '@/lib/queryClient.config';
import { RoomType } from '@/interfaces/RoomType.interface';
import { useRoomTypes } from '@/features/room-type/queries';
import { Room, RoomStatus } from '@/interfaces/Room.interface';
import { useCreateRoom, useUpdateRoom } from '@/features/room/mutations';

const roomFormSchema = z.object({
    roomNumber: z
        .number()
        .nonnegative('The room number must not be negative')
        .gt(0, 'The room number must be larger than 0'),
    status: z.enum(RoomStatus),
    cinemaId: z.string().nonempty('Cinema required'),
    roomTypeId: z.string().nonempty('Room Type required'),
    totalColumn: z
        .number()
        .nonnegative('The number of column must not be negative')
        .gt(0, 'The room number must be larger than 0'),
    totalRow: z
        .number()
        .nonnegative('The number of row must not be negative')
        .gt(0, 'The room number must be larger than 0')
        .lte(26, 'The maximum rows must less than or equal to 26'),
});

interface RoomFormProps {
    room?: Room;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const RoomForm = ({ room, openForm, setOpenForm }: RoomFormProps) => {
    const { id: cinemaId } = useParams<{ id: string }>();

    const { mutate: createRoom, isPending: createPending } = useCreateRoom();
    const { mutate: updateRoom, isPending: updatePending } = useUpdateRoom();

    const { data = [], isPending: getRoomTypePending, isError: getRoomTypeError } = useRoomTypes({});
    const roomTypes = data as RoomType[];
    const roomTypeOptions = roomTypes.map((type) => ({
        label: type.type,
        value: type.id,
    }));

    const initialValue = {
        roomNumber: 0,
        status: RoomStatus.INACTIVE,
        cinemaId: cinemaId,
        roomTypeId: '',
        totalColumn: 0,
        totalRow: 0,
    };
    const form = useForm<z.infer<typeof roomFormSchema>>({
        resolver: zodResolver(roomFormSchema),
        defaultValues: initialValue,
    });

    const onSubmit = (data: z.infer<typeof roomFormSchema>) => {
        if (room) {
            updateRoom(
                { id: room.id, data },
                {
                    onSuccess: (res) => {
                        if (res.result) {
                            setOpenForm(false);
                            queryClient.invalidateQueries({ queryKey: ['rooms', cinemaId] });
                            queryClient.invalidateQueries({ queryKey: ['room', cinemaId, room.id] });
                            queryClient.invalidateQueries({ queryKey: ['seats', room.id] });
                            toast.success('Update room successfully', { richColors: true });
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createRoom(data, {
                onSuccess: (res) => {
                    if (res.result) {
                        setOpenForm(false);
                        queryClient.invalidateQueries({ queryKey: ['rooms', cinemaId] });
                        toast.success('Create room successfully', { richColors: true });
                        form.reset();
                    }
                },
                onError: (error) => {
                    toast.error(error.message, { richColors: true });
                },
            });
        }
    };

    const onError = (error: FieldErrors) => {
        console.log(error);
    };

    useEffect(() => {
        if (!openForm || !room) return;
        const defaultVal = room ? { ...room, cinemaId } : { ...initialValue };
        form.reset(defaultVal);
    }, [room, openForm, form]);

    if (getRoomTypeError) return;

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
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="overflow-y-scroll p-1 max-h-[70vh] relative"
                >
                    <FieldGroup className="gap-3">
                        <Controller
                            name="roomNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="room-room-number">Room Number</FieldLabel>
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
                                        disabled={createPending || updatePending}
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
                                            disabled={createPending || updatePending}
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
                        {getRoomTypePending ? (
                            <div>Loading...</div>
                        ) : (
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
                                                disabled={createPending || updatePending}
                                            >
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned" align="end">
                                                {roomTypeOptions.map((type) => (
                                                    <SelectItem
                                                        key={type.value}
                                                        value={type.value}
                                                        className="capitalize"
                                                    >
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        )}
                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="totalColumn"
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
                                            disabled={createPending || updatePending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="totalRow"
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
                                            disabled={createPending || updatePending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <DialogFooter className="sticky bottom-0 bg-background">
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

export default RoomForm;
