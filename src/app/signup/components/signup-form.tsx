'use client';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';

import { useRegisterMutation } from '@/features/auth/mutations';

const signUpFormSchema = z
    .object({
        fullname: z.string().nonempty('Full Name required').min(6, 'Full name must have at least 6 characters'),
        email: z.email('Invalid email format').nonempty('Email required'),
        password: z.string().nonempty('Password required').min(6, 'Password must have at least 6 characters'),
        confirmPassword: z.string().nonempty('Confirm Password required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Confirm passwords don't match",
        path: ['confirmPassword'], // This specifies where the error message will be displayed
    });

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
    const { mutate, isPending } = useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            fullname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: z.infer<typeof signUpFormSchema>) => {
        mutate(data);
    };

    return (
        <form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-3">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Fill in the form below to create your account
                    </p>
                </div>
                <Controller
                    name="fullname"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-1">
                            <FieldLabel htmlFor="signup-fullname">Full Name</FieldLabel>
                            <Input
                                {...field}
                                id="signup-fullname"
                                aria-invalid={fieldState.invalid}
                                placeholder="Aa..."
                                autoComplete="off"
                                disabled={isPending}
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
                            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                            <Input
                                {...field}
                                id="signup-email"
                                aria-invalid={fieldState.invalid}
                                placeholder="example@gmail.com"
                                autoComplete="off"
                                disabled={isPending}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Field>
                    <Field className="grid grid-cols-2 gap-4">
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="signup-password"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type={showPassword ? 'text' : 'password'}
                                            disabled={isPending}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                aria-label="Copy"
                                                title="Copy"
                                                size="icon-xs"
                                                disabled={isPending}
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
                                    <FieldLabel htmlFor="signup-confirm-password">Confirm Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id="signup-confirm-password"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            type={showPassword ? 'text' : 'password'}
                                            disabled={isPending}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                                aria-label="Copy"
                                                title="Copy"
                                                size="icon-xs"
                                                disabled={isPending}
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
                    </Field>
                </Field>
                <Field>
                    <Button type="submit" disabled={isPending} className="flex items-center justify-center">
                        {isPending && <LoaderCircle className="animate-spin" />}
                        {isPending ? 'Processing Create Account...' : 'Create Account'}
                    </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                </FieldSeparator>
                <Field>
                    <Button variant="outline" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        <span>Sign up with Google</span>
                    </Button>
                </Field>
                <FieldDescription className="text-center">
                    Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
