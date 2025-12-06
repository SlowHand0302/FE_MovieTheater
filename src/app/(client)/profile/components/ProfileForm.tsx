import * as z from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { User } from '@/interfaces/User.interface';
import { Auditable } from '@/interfaces/Auditable.interface';

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
import DatePicker from '@/components/DatePicker';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const profileFormSchema = z.object({
    fullname: z.string().nonempty('Fullname required').min(6, 'Full name must have at least 6 characters'),
    email: z.email('Invalid email format').nonempty('Email required'),
    password: z.string().nonempty('Password required'),
    phoneNumber: z
        .string()
        .nonempty('Phone number required')
        .regex(/(0[3|5|7|8|9])[0-9]{8}\b/, 'Invalid phone number format'),
    dayOfBirth: z.date('Date format is not valid'),
    gender: z.string().nonempty('Gender required'),
    address: z.string().nonempty('Address required'),
});

interface ProfileFormProps {
    profile?: Omit<User, keyof Auditable | 'isVerified' | 'point' | 'role' | 'password'>;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const ProfileForm = ({ profile, openForm, setOpenForm }: ProfileFormProps) => {
    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullname: '',
            email: '',
            password: '',
            phoneNumber: '',
            dayOfBirth: new Date(),
            gender: '',
            address: '',
        },
    });

    const onSubmit = (data: z.infer<typeof profileFormSchema>) => {
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
        const defaultVal = profile
            ? { ...profile }
            : {
                  fullname: '',
                  email: '',
                  password: '',
                  phoneNumber: '',
                  dayOfBirth: new Date(),
                  gender: '',
                  address: '',
              };
        form.reset(defaultVal);
    }, [profile, openForm, form]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="max-w-[90vw] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{profile ? 'Edit your' : 'Create new'} profile</DialogTitle>
                    <DialogDescription>
                        {profile ? 'Make changes to your Profile' : 'Create new Profile'} here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    id="form-profile"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="overflow-y-scroll p-1 max-h-[70vh] relative"
                >
                    <FieldGroup className="gap-3">
                        <Controller
                            name="fullname"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="profile-fullname">Fullname</FieldLabel>
                                    <Input
                                        {...field}
                                        id="profile-fullname"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                            <Controller
                                name="phoneNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="profile-phoneNumber">Phone Number</FieldLabel>
                                        <Input
                                            {...field}
                                            id="profile-phoneNumber"
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
                                        <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="profile-email"
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
                                name="gender"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldContent>
                                            <FieldLabel htmlFor="profile-gender">Gender</FieldLabel>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                        <Controller
                            name="address"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="profile-address">Address</FieldLabel>
                                    <Input
                                        {...field}
                                        id="profile-address"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

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

export default ProfileForm;
