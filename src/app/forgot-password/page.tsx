'use client';
import * as z from 'zod';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { LoaderCircle, GalleryVerticalEnd } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useForgetPassword } from '@/features/auth/mutations';
import { useAuthStore } from '@/features/auth/useAuthStore';

const forgotPasswordFormSchema = z.object({
    email: z.email('Invalid email format').nonempty('Email required'),
});

const Page = () => {
    const { mutate, isPending } = useForgetPassword();
    const { setVerifyId } = useAuthStore();

    const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordFormSchema>) => {
        mutate(data, {
            onSuccess: () => {
                setVerifyId(data.email);
            },
        });
    };

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Cine Inc.
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <form className={cn('flex flex-col gap-6')} onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <h1 className="text-2xl font-bold">Reset your password</h1>
                                    <p className="text-muted-foreground text-sm text-balance">
                                        Enter your email below to reset your password
                                    </p>
                                </div>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="gap-1">
                                            <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
                                            <Input
                                                {...field}
                                                id="forgot-password-email"
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
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex items-center justify-center"
                                    >
                                        {isPending && <LoaderCircle className="animate-spin" />}
                                        {isPending ? 'Processing reset password...' : 'Reset password'}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://ui.shadcn.com/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
};

export default Page;
