import * as z from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
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
import { LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cinema, CinemaStatus } from '@/interfaces/Cinema.interface';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { queryClient } from '@/lib/queryClient.config';
import { time12hTo24Hour } from '@/lib/dateTime.helper';
import { useCreateCinema, useUpdateCinema } from '@/features/cinema/mutations';

const cinemaFormSchema = z
    .object({
        name: z.string().nonempty('Name required').min(6, 'Name must have at least 6 characters'),
        address: z.string().nonempty('Address required'),
        city: z.string().nonempty('Region required'),
        phoneNumber: z
            .string()
            .nonempty('Phone number required')
            .regex(/(0[3|5|7|8|9])[0-9]{8}\b/, 'Invalid phone number format'),
        email: z.email('Invalid email format').nonempty('Email required'),
        open_Time: z.iso.time('Invalid time format').nonempty('Open time required'),
        close_Time: z.iso.time('Invalid time format').nonempty('Close Time required'),
        status: z.enum(CinemaStatus),
    })
    .refine((values) => values.open_Time < values.close_Time, {
        error: 'Close time must be after open time',
        path: ['close_Time'],
    });

interface CinemaFormProps {
    cinema?: Cinema;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const CinemaForm = ({ cinema, openForm, setOpenForm }: CinemaFormProps) => {
    const { mutate: createCinema, isPending: createPending } = useCreateCinema();
    const { mutate: updateCinema, isPending: updatePending } = useUpdateCinema();

    const initialValue = {
        name: '',
        address: '',
        city: '',
        phoneNumber: '',
        email: '',
        open_Time: '09:00',
        close_Time: '23:00',
        status: CinemaStatus.INACTIVE,
    };

    const form = useForm<z.infer<typeof cinemaFormSchema>>({
        resolver: zodResolver(cinemaFormSchema),
        defaultValues: initialValue,
    });

    const onSubmit = (data: z.infer<typeof cinemaFormSchema>) => {
        if (cinema) {
            updateCinema(
                { id: cinema.id, data },
                {
                    onSuccess: (res) => {
                        if (res.result) {
                            setOpenForm(false);
                            queryClient.invalidateQueries({ queryKey: ['cinemas', {}] });
                            toast.success('Create cinema successfully', { richColors: true });
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createCinema(data, {
                onSuccess: (res) => {
                    if (res.result) {
                        setOpenForm(false);
                        queryClient.invalidateQueries({ queryKey: ['cinemas', {}] });
                        toast.success('Create cinema successfully', { richColors: true });
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
        const defaultVal = cinema
            ? {
                  ...cinema,
                  open_Time: time12hTo24Hour(cinema.open_Time),
                  close_Time: time12hTo24Hour(cinema.close_Time),
              }
            : initialValue;
        form.reset(defaultVal);
    }, [cinema, openForm, form]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="max-w-[90vw] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{cinema ? 'Edit this' : 'Create new'} cinema</DialogTitle>
                    <DialogDescription>
                        {cinema ? 'Make changes to this cinema' : 'Create new cinema'} here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="form-cinema"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="overflow-y-scroll p-1 max-h-[70vh] relative"
                >
                    <FieldGroup className="gap-3">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="cinema-name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="cinema-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                        disabled={updatePending || createPending}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="address"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="cinema-address">Address</FieldLabel>
                                    <Input
                                        {...field}
                                        id="cinema-address"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                        disabled={updatePending || createPending}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="city"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="cinema-city">Region</FieldLabel>
                                        <Input
                                            {...field}
                                            id="cinema-city"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Aa..."
                                            autoComplete="off"
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
                                        <FieldLabel htmlFor="cinema-status">Status</FieldLabel>
                                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id="cinema-status"
                                                aria-invalid={fieldState.invalid}
                                                className="min-w-[120px] capitalize"
                                            >
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned" align="end">
                                                {Object.entries(CinemaStatus).map(([key, value]) => (
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
                        </div>
                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="phoneNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="cinema-phoneNumber">Phone Number</FieldLabel>
                                        <Input
                                            {...field}
                                            id="cinema-phoneNumber"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Aa..."
                                            autoComplete="off"
                                            disabled={updatePending || createPending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="cinema-email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="cinema-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Aa..."
                                            autoComplete="off"
                                            disabled={updatePending || createPending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="open_Time"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="cinema-open-time">Open Time</FieldLabel>
                                        <Input
                                            {...field}
                                            type="time"
                                            id="cinema-open-time"
                                            step="60"
                                            disabled={updatePending || createPending}
                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="close_Time"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="cinema-close-time">Close Time</FieldLabel>
                                        <Input
                                            {...field}
                                            type="time"
                                            id="cinema-close-time"
                                            step="60"
                                            disabled={updatePending || createPending}
                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                                    disabled={updatePending || createPending}
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
                                      : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CinemaForm;
