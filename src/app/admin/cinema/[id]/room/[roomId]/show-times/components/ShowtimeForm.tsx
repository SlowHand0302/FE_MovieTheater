import * as z from 'zod';
import { toast } from 'sonner';
import React, { useEffect, useState } from 'react';
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
import { Check, ChevronDown, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FieldGroup, Field, FieldLabel, FieldError, FieldContent } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShowTimeByRoomResult } from '@/features/show-time/DTOs/GetShowTimes.dto';
import { useCreateShowTime, useUpdateShowTime } from '@/features/show-time/mutations';
import { ShowTimeStatus } from '@/interfaces/Showtime.interface';
import { useRoom, useRooms } from '@/features/room/queries';
import { useCinema, useCinemas } from '@/features/cinema/queries';
import { useMovieList } from '@/features/movie/queries';
import { Room } from '@/interfaces/Room.interface';
import { Cinema } from '@/interfaces/Cinema.interface';
import DatePicker from '@/components/DatePicker';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { queryClient } from '@/lib/queryClient.config';

const showtimeFormSchema = z
    .object({
        movieId: z.uuid({ message: 'Movie is required' }),
        roomId: z.uuid({ message: 'Room is required' }),
        startTime: z.date({
            message: 'Invalid start time format',
        }),
        endTime: z.date({
            message: 'Invalid end time format',
        }),
        status: z.enum(ShowTimeStatus),
    })
    .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
        message: 'End time must be after start time',
        path: ['endTime'],
    });

interface ShowtimeFormProps {
    showtime?: ShowTimeByRoomResult;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const ShowtimeForm = ({ openForm, setOpenForm, showtime }: ShowtimeFormProps) => {
    const { id: cinemaId, roomId } = useParams<{ id: string; roomId: string }>();
    const [openCommand, setOpenCommand] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const { data: moviesData, isPending: moviePending, error: movieError } = useMovieList();
    const { data: cinemaData, isPending: cinemaPending, error: cinemaError } = useCinema(cinemaId);
    const { data: roomData, isPending: roomPending, error: roomError } = useRoom({ cinemaId, roomId });

    const room = roomData as Room;
    const cinema = cinemaData as Cinema;
    const movieOptions = (moviesData as MovieBaseResultData[])?.map((g) => ({ label: g.name, value: g.id }));
    const filtered = movieOptions?.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

    const { mutate: createShowtime, isPending: createPending } = useCreateShowTime();
    const { mutate: updateShowtime, isPending: updatePending } = useUpdateShowTime();

    const initialValue = {
        movieId: '',
        roomId: roomId,
        startTime: new Date(),
        endTime: new Date(),
        status: ShowTimeStatus.SCHEDULED,
    };
    const form = useForm<z.infer<typeof showtimeFormSchema>>({
        resolver: zodResolver(showtimeFormSchema),
        defaultValues: initialValue,
    });

    const onSubmit = (data: z.infer<typeof showtimeFormSchema>) => {
        console.log(data);

        // createShowtime(data, {
        //     onSuccess: (res) => {
        //         if (res.result) {
        //             setOpenForm(false);
        //             queryClient.invalidateQueries({ queryKey: ['rooms', cinemaId] });
        //             toast.success('Create room successfully', { richColors: true });
        //             form.reset();
        //         }
        //     },
        //     onError: (error) => {
        //         toast.error(error.message, { richColors: true });
        //     },
        // });
    };

    const onError = (error: FieldErrors) => {};

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="max-w-[90vw] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{showtime ? 'Edit this' : 'Create new'} showtime</DialogTitle>
                    <DialogDescription>
                        {showtime ? 'Make changes to this showtime' : 'Create new showtime'} here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="form-room"
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="overflow-y-scroll p-1 max-h-[70vh] relative"
                >
                    {cinemaPending || roomPending ? (
                        <div>Loading...</div>
                    ) : (
                        <Field className="gap-1">
                            <FieldLabel htmlFor="showtime-location">Location</FieldLabel>
                            <Input
                                id="showtime-location"
                                placeholder="Aa..."
                                autoComplete="off"
                                defaultValue={
                                    room && cinema && room.roomNumber + ' - ' + cinema.name + ' - ' + cinema.city
                                }
                                disabled
                            />
                        </Field>
                    )}
                    <FieldGroup className="gap-3">
                        <Controller
                            name="movieId"
                            control={form.control}
                            render={({ fieldState, field }) => (
                                <Field className="pt-1 gap-1" data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-sm font-medium">Movie</FieldLabel>
                                    <Popover open={openCommand} onOpenChange={setOpenCommand}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between h-auto flex-wrap gap-2 ',
                                                    field.value && 'hover:bg-transparent',
                                                )}
                                                aria-invalid={fieldState.invalid}
                                            >
                                                {field.value ? (
                                                    <span className="text-muted-foreground font-normal">
                                                        {
                                                            movieOptions?.filter((opt) => opt.value === field.value)[0]
                                                                .label
                                                        }
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground font-normal">
                                                        Select movie...
                                                    </span>
                                                )}
                                                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search movie..."
                                                    value={search}
                                                    onValueChange={setSearch}
                                                />
                                                <CommandEmpty>No movie found.</CommandEmpty>
                                                <CommandGroup className="max-h-64 overflow-auto">
                                                    {filtered?.map((opt) => (
                                                        <CommandItem
                                                            key={opt.value}
                                                            onSelect={() => {
                                                                form.setValue('movieId', opt.value);
                                                                setOpenCommand(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    field.value === opt.value
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
                                    {fieldState.invalid && (
                                        <p className="text-sm text-destructive">{fieldState.error?.message}</p>
                                    )}
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
                                            {Object.entries(ShowTimeStatus).map(([key, value]) => (
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

                        <div className="flex md:gap-7 gap-2 flex-col md:flex-row">
                            <Controller
                                name="startTime"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="showtime-start-time">Start Time</FieldLabel>
                                        <DatePicker
                                            selectedDate={field.value}
                                            setSelectedDate={field.onChange}
                                            withTimePicker={true}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="endTime"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="showtime-end-time">End Time</FieldLabel>
                                        <DatePicker
                                            selectedDate={field.value}
                                            setSelectedDate={field.onChange}
                                            withTimePicker={true}
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

export default ShowtimeForm;
