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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cinema, CinemaStatus } from '@/interfaces/Cinema.interface';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const cinemaFormSchema = z
    .object({
        name: z.string().nonempty('Name required'),
        address: z.string().nonempty('Address required'),
        phoneNumber: z
            .string()
            .nonempty('Phone number required')
            .regex(/(0[3|5|7|8|9])[0-9]{8}\b/, 'Invalid phone number format'),
        email: z.email('Invalid email format').nonempty('Email required'),
        open_Time: z.iso.time('Invalid time format').nonempty('Open time required'),
        close_Time: z.iso.time('Invalid time format').nonempty('Close Time required'),
        status: z.string().nonempty('Status required'),
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
    const form = useForm<z.infer<typeof cinemaFormSchema>>({
        resolver: zodResolver(cinemaFormSchema),
        defaultValues: {
            name: '',
            address: '',
            phoneNumber: '',
            email: '',
            open_Time: '09:00',
            close_Time: '23:00',
            status: 'inactive',
        },
    });

    const onSubmit = (data: z.infer<typeof cinemaFormSchema>) => {
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
        const defaultVal = cinema
            ? { ...cinema }
            : {
                  name: '',
                  address: '',
                  phoneNumber: '',
                  email: '',
                  open_Time: '09:00:00',
                  close_Time: '23:00:00',
                  status: 'inactive',
              };
        form.reset(defaultVal);
    }, [cinema, openForm, form]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="max-w-[90vw] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{cinema ? 'Edit' : 'Create new'} new Cinema</DialogTitle>
                    <DialogDescription>
                        {cinema ? 'Make changes to your Room Type' : 'Create new Room Type'} here. Click save when
                        you&apos;re done.
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
                                        <FieldLabel htmlFor="cinema-status">Status</FieldLabel>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </FieldContent>
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
                                </Field>
                            )}
                        />
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
                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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

export default CinemaForm;
