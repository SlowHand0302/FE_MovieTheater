'use client';
import { z } from 'zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';

import { useAuthStore } from '@/features/auth/useAuthStore';
import { useVerifyPassword } from '@/features/auth/mutations';

const otpSchema = z
    .object({
        otp: z
            .string()
            .min(6, 'Code must be 6 digits')
            .max(6, 'Code must be 6 digits')
            .regex(/^\d{6}$/, 'Code must contain numbers only'),
        email: z.email('Invalid email format').nonempty('Email required'),
        password: z.string().nonempty('Password required').min(6, 'Password must have at least 6 characters'),
        confirmPassword: z.string().nonempty('Confirm Password required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Confirm passwords don't match",
        path: ['confirmPassword'], // This specifies where the error message will be displayed
    });

type OTPFormValues = z.infer<typeof otpSchema>;

export default function Page() {
    const { verifyId } = useAuthStore();
    const { mutate: mutateVerifyPassword, isPending } = useVerifyPassword();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<OTPFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = form;

    const onSubmit = (data: OTPFormValues) => {
        if (verifyId) {
            mutateVerifyPassword({ email: data.email, otp: data.otp, newPassword: data.password });
        }
    };

    return (
        <div className={cn('flex flex-col gap-6')}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="gap-3">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Enter verification code</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            We sent a 6-digit code to your email.
                        </p>
                    </div>
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
                                        <FieldLabel htmlFor="signup-password">New Password</FieldLabel>
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
                                        <FieldLabel htmlFor="signup-confirm-password">Confirm New Password</FieldLabel>
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
                        <FieldLabel htmlFor="otp" className="sr-only">
                            Verification code
                        </FieldLabel>

                        <FieldDescription className="text-center">
                            Enter the 6-digit code sent to your email.
                        </FieldDescription>

                        <InputOTP
                            maxLength={6}
                            id="otp"
                            {...register('otp')}
                            value={form.watch('otp')}
                            onChange={(val) => setValue('otp', val, { shouldValidate: true })}
                            containerClassName="justify-center"
                        >
                            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                            </InputOTPGroup>

                            <InputOTPSeparator />

                            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>

                            <InputOTPSeparator />

                            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        {/* 🔹 Error Message */}
                        {errors.otp && <p className="text-red-500 text-sm text-center mt-1">{errors.otp.message}</p>}
                    </Field>

                    <Field>
                        <Button type="submit" disabled={isPending} className="flex items-center justify-center">
                            {isPending && <LoaderCircle className="animate-spin" />}
                            {isPending ? 'Processing verifying...' : 'Verify'}
                        </Button>
                    </Field>
                    <FieldDescription className="text-center">
                        Didn&apos;t receive the code?{' '}
                        <a href="#" className="underline">
                            Resend
                        </a>
                    </FieldDescription>
                </FieldGroup>
            </form>
        </div>
    );
}
