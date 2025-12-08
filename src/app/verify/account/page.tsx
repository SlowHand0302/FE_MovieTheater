'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

import { useAuthStore } from '@/features/auth/useAuthStore';
import { useVerifyAccount } from '@/features/auth/mutations';

const verifyAccountFormSchema = z.object({
    otp: z
        .string()
        .min(6, 'Code must be 6 digits')
        .max(6, 'Code must be 6 digits')
        .regex(/^\d{6}$/, 'Code must contain numbers only'),
});

type OTPFormValues = z.infer<typeof verifyAccountFormSchema>;

export default function VerifyAccountForm() {
    const { verifyId } = useAuthStore();
    const { mutate: mutateVerifyAccount, isPending } = useVerifyAccount();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OTPFormValues>({
        resolver: zodResolver(verifyAccountFormSchema),
        defaultValues: {
            otp: '',
        },
    });

    const onSubmit = (data: OTPFormValues) => {
        if (verifyId) {
            mutateVerifyAccount({ userId: verifyId, code: data.otp });
        }
    };

    return (
        <div className={cn('flex flex-col gap-6')}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Enter verification code</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            We sent a 6-digit code to your email.
                        </p>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="otp" className="sr-only">
                            Verification code
                        </FieldLabel>

                        <InputOTP
                            maxLength={6}
                            id="otp"
                            {...register('otp')}
                            value={watch('otp')}
                            onChange={(val) => setValue('otp', val, { shouldValidate: true })}
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

                        <FieldDescription className="text-center">
                            Enter the 6-digit code sent to your email.
                        </FieldDescription>
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
