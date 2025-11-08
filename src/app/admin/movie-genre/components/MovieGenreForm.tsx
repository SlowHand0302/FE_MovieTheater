'use client';
import * as z from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { MovieGenre } from '@/interfaces/MovieGenre.interface';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

const movieGenreFormSchema = z.object({
    name: z.string().nonempty('Movie Genre Name required'),
});

interface MovieGenreFormProps {
    genre?: MovieGenre;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const MovieGenreForm = ({ genre, openForm, setOpenForm }: MovieGenreFormProps) => {
    const form = useForm<z.infer<typeof movieGenreFormSchema>>({
        resolver: zodResolver(movieGenreFormSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = (data: z.infer<typeof movieGenreFormSchema>) => {
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
        const defaultValue = genre ? { ...genre } : { name: '' };
        form.reset(defaultValue);
    }, [genre, form, openForm]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new Movie Genre</DialogTitle>
                    <DialogDescription>
                        {genre ? 'Make changes to your Movie Genre' : 'Create new Movie Genre'} here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form id="form-cinema" onSubmit={form.handleSubmit(onSubmit)}>
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
                        <DialogFooter>
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

export default MovieGenreForm;
