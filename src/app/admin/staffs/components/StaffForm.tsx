'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FieldErrors, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Staff } from '@/interfaces/User.interface';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCreateStaff, useUpdateStaff } from '@/features/user/mutations/staff.mutation';
import DatePicker from '@/components/DatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, Command } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCinemas } from '@/features/cinema/queries';
import { Cinema } from '@/interfaces/Cinema.interface';
import useDebounce from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient.config';

const staffFormSchema = z
    .object({
        fullName: z.string().nonempty('Full Name required').min(6, 'Full name must have at least 6 characters'),
        email: z.email('Invalid email format').nonempty('Email required'),
        password: z.string().nonempty('Password required').min(6, 'Password must have at least 6 characters'),
        confirmPassword: z.string().nonempty('Confirm Password required'),
        phoneNumber: z
            .string()
            .nonempty('Phone number required')
            .regex(/(0[3|5|7|8|9])[0-9]{8}\b/, 'Invalid phone number format'),
        dayOfBirth: z.date('Date format is not valid'),
        gender: z.string().nonempty('Gender required'),
        position: z.string().nonempty('Position required'),
        salary: z.number().gt(0, 'Salary must not be 0 or negative'),
        cinemaId: z.string().nonempty('Cinema required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Confirm passwords don't match",
        path: ['confirmPassword'], // This specifies where the error message will be displayed
    });

interface StaffFormProps {
    staff?: Staff;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const StaffForm = ({ staff, openForm, setOpenForm }: StaffFormProps) => {
    const { mutate: createStaff, isPending: createPending } = useCreateStaff();
    const { mutate: updateStaff, isPending: updatePending } = useUpdateStaff();

    const [showPassword, setShowPassword] = useState(false);
    const [openCommand, setOpenCommand] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearchTerm = useDebounce(search, 500);
    const {
        data: cinemaData = [],
        isPending: getCinemaPending,
        isError: getCinemaError,
    } = useCinemas({ Name: debouncedSearchTerm });
    const options = (cinemaData as Cinema[]).map((movie) => ({ value: movie.id, label: movie.name }));

    const initialValues: z.infer<typeof staffFormSchema> = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        dayOfBirth: new Date(),
        gender: '',
        position: '',
        salary: 0,
        cinemaId: '',
    };
    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: initialValues,
    });
    const watchCinema = form.watch('cinemaId');
    const onSubmit = (data: z.infer<typeof staffFormSchema>) => {
        if (staff) {
            updateStaff(
                { staffId: '99176018-d2bd-4208-8bcc-7d8a557775d7', data: { ...data, isVerified: true, role: 'staff' } },
                {
                    onSuccess: (res) => {
                        if (res.result) {
                            queryClient.invalidateQueries({ queryKey: ['staffs'] });
                            toast.success('Create food and drink successfully', { richColors: true });
                            setOpenForm(false);
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        console.log(error);

                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createStaff(
                {
                    ...data,
                    isVerified: true,
                    role: 'staff',
                },
                {
                    onSuccess: (res) => {
                        if (res.result) {
                            queryClient.invalidateQueries({ queryKey: ['staffs'] });
                            toast.success('Create food and drink successfully', { richColors: true });
                            setOpenForm(false);
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        }
    };
    const onError = (error: FieldErrors) => {
        console.log(error);
    };

    useEffect(() => {
        if (!openForm || !staff) {
            return;
        }
        const defaultValue = staff
            ? { ...staff, dayOfBirth: new Date(staff.dayOfBirth), confirmPassword: '', password: '' }
            : initialValues;
        form.reset(defaultValue);
    }, [staff, openForm, form]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="max-w-[90vw] md:max-w-[70vw] overflow-x-visible">
                <DialogHeader>
                    <DialogTitle>{staff ? 'Edit this' : 'Create new'} staff</DialogTitle>
                    <DialogDescription>
                        {staff ? 'Make changes to this staff' : 'Create new staff'} here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="form-staff"
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="overflow-y-scroll  p-1 max-h-[70vh]"
                >
                    <FieldGroup className="gap-3">
                        <Controller
                            name="fullName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="staff-fullName">FullName</FieldLabel>
                                    <Input
                                        {...field}
                                        id="staff-fullName"
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
                            name="cinemaId"
                            control={form.control}
                            render={({ fieldState, field }) => (
                                <Field className="pt-1 gap-1" data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-sm font-medium">Cinema</FieldLabel>
                                    <Popover open={openCommand} onOpenChange={setOpenCommand}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between h-auto flex-wrap gap-2 ',
                                                    watchCinema && 'hover:bg-transparent',
                                                )}
                                                aria-invalid={fieldState.invalid}
                                            >
                                                {watchCinema.length > 0 ? (
                                                    <span className="text-muted-foreground font-normal">
                                                        {options.find((opt) => opt.value === field.value)?.label}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground font-normal">
                                                        Select cinema...
                                                    </span>
                                                )}
                                                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search genres..."
                                                    value={search}
                                                    onValueChange={setSearch}
                                                />
                                                {getCinemaError && (
                                                    <div className="text-center py-10 text-gray-600">
                                                        There are some error happened.
                                                    </div>
                                                )}
                                                {getCinemaPending ? (
                                                    <div className="text-center py-10 text-gray-600 w-full">
                                                        <LoaderCircle className="animate-spin text-5xl mx-auto" />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <CommandEmpty>No genre found.</CommandEmpty>
                                                        <CommandGroup className="max-h-64 overflow-auto">
                                                            {options.map((opt) => (
                                                                <CommandItem
                                                                    key={opt.value}
                                                                    onSelect={() => {
                                                                        form.setValue('cinemaId', opt.value);
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
                                                    </>
                                                )}
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {fieldState.invalid && (
                                        <p className="text-sm text-destructive">{fieldState.error?.message}</p>
                                    )}
                                </Field>
                            )}
                        />

                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="phoneNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="staff-phoneNumber">Phone Number</FieldLabel>
                                        <Input
                                            {...field}
                                            id="staff-phoneNumber"
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
                                        <FieldLabel htmlFor="staff-email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="staff-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="example@gmail.com"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="gender"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldContent>
                                            <FieldLabel htmlFor="profile-gender">Gender</FieldLabel>
                                        </FieldContent>
                                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id="profile-gender"
                                                aria-invalid={fieldState.invalid}
                                                className="min-w-[120px] capitalize"
                                            >
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned" align="end">
                                                <SelectItem value={'male'} className="capitalize">
                                                    Male
                                                </SelectItem>
                                                <SelectItem value={'female'} className="capitalize">
                                                    Female
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="dayOfBirth"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="profile-open-time">Birth Day</FieldLabel>
                                        <DatePicker selectedDate={field.value} setSelectedDate={field.onChange} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="salary"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="staff-salary">Salary</FieldLabel>
                                        <Input
                                            {...field}
                                            id="staff-salary"
                                            aria-invalid={fieldState.invalid}
                                            type="number"
                                            value={field.value === null ? '' : String(field.value)} // Handle null for display
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === '' ? null : Number(value)); // Convert to number or null
                                            }}
                                            step={10000}
                                            disabled={createPending || updatePending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="position"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldContent>
                                            <FieldLabel htmlFor="profile-position">Position</FieldLabel>
                                        </FieldContent>
                                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id="profile-position"
                                                aria-invalid={fieldState.invalid}
                                                className="min-w-[120px] capitalize"
                                            >
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned" align="end">
                                                {[
                                                    { label: 'staff', value: 'staff' },
                                                    { label: 'Cinema Manager', value: 'cinema_manager' },
                                                    { label: 'Operations Manager', value: 'operations_manager' },
                                                ].map((position, index) => {
                                                    return (
                                                        <SelectItem
                                                            key={index}
                                                            value={position.value}
                                                            className="capitalize"
                                                        >
                                                            {position.label}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="staff-password">Password</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                id="staff-password"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                type={showPassword ? 'text' : 'password'}
                                                disabled={createPending || updatePending}
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton
                                                    aria-label="Copy"
                                                    title="Copy"
                                                    size="icon-xs"
                                                    disabled={createPending || updatePending}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <Eye /> : <EyeOff />}
                                                </InputGroupButton>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="staff-confirm-password">Confirm Password</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                id="staff-confirm-password"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                type={showPassword ? 'text' : 'password'}
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton
                                                    aria-label="Copy"
                                                    title="Copy"
                                                    size="icon-xs"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <Eye /> : <EyeOff />}
                                                </InputGroupButton>
                                            </InputGroupAddon>
                                        </InputGroup>
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

export default StaffForm;
