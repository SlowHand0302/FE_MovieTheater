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
import { useCreateMovieGenre, useUpdateMovieGenre } from '@/features/movie-genre/mutations';
import { queryClient } from '@/lib/queryClient.config';
import { LoaderCircle } from 'lucide-react';

const movieGenreFormSchema = z.object({
    name: z.string().nonempty('Movie Genre Name required'),
});

interface MovieGenreFormProps {
    genre?: MovieGenre;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const MovieGenreForm = ({ genre, openForm, setOpenForm }: MovieGenreFormProps) => {
    const { mutate: createGenre, isPending: createPending } = useCreateMovieGenre();
    const { mutate: updateGenre, isPending: updatePending } = useUpdateMovieGenre();

    const form = useForm<z.infer<typeof movieGenreFormSchema>>({
        resolver: zodResolver(movieGenreFormSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = (data: z.infer<typeof movieGenreFormSchema>) => {
        if (genre) {
            updateGenre(
                { id: genre.id, data },
                {
                    onSuccess: (res) => {
                        if (res) {
                            setOpenForm(false);
                            queryClient.invalidateQueries({ queryKey: ['genres'] });
                            toast.success('Create room type successfully', { richColors: true });
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createGenre(data, {
                onSuccess: (res) => {
                    if (res) {
                        setOpenForm(false);
                        queryClient.invalidateQueries({ queryKey: ['genres'] });
                        toast.success('Create room type successfully', { richColors: true });
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
        const defaultValue = genre ? { ...genre } : { name: '' };
        form.reset(defaultValue);
    }, [genre, form, openForm]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{genre ? 'Edit this' : 'Create new'} movie genre</DialogTitle>
                    <DialogDescription>
                        {genre ? 'Make changes to this movie genre' : 'Create new movie genre'} here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form id="form-movie-genre" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-3">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-1">
                                    <FieldLabel htmlFor="movie-genre-name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="movie-genre-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aa..."
                                        autoComplete="off"
                                        disabled={createPending || updatePending}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    disabled={createPending || updatePending}
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
                                      : 'Save Changes'}{' '}
                            </Button>
                        </DialogFooter>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MovieGenreForm;
