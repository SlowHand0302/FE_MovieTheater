'use client';
import * as z from 'zod';
import React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';

import GenresSection from './GenresSection';
import { LoaderCircle } from 'lucide-react';
import CastCrewSection from './CastCrewSection';
import { Button } from '@/components/ui/button';
import BasicInfoSection from './BasicInfoSection';
import { FieldGroup } from '@/components/ui/field';
import { FileUploader } from '@/components/FileUploader';
import ProductionInfoSection from './ProductionInfoSection';

import { convertToFormData } from '@/lib/utils';
import { queryClient } from '@/lib/queryClient.config';
import { useCreateMovie } from '@/features/movie/mutations';
import { MovieStatus } from '@/interfaces/Movie.interface';

export const moviePersonSchema = z.object({
    personId: z.string().min(1, 'Person ID is required'),
    role: z.string().min(1, 'Role is required'),
});

export const movieGenreSchema = z.object({
    genreId: z.string().min(1, 'Genre name is required'),
});

export const movieSchema = z.object({
    name: z.string().min(1, 'Movie name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    releaseDate: z.date('Release date is required'),
    duration: z.date('Duration required'),
    publisher: z.string().min(1, 'Publisher is required'),
    country: z.string().min(1, 'Country is required'),
    language: z.string().min(1, 'Language is required'),
    poster: z
        .array(z.custom<File>())
        .min(1, 'Poster is required')
        .max(2, 'File selected up to file')
        .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
            message: 'File size must be less than 5MB',
        }),
    trailerUrl: z.url('Must be a valid URL'),
    genres: z.array(movieGenreSchema).min(1, 'At least one genre is required'),
    persons: z.array(moviePersonSchema).min(1, 'At least one person is required'),
    status: z.enum(MovieStatus),
});

export type MovieFormData = z.infer<typeof movieSchema>;

export default function MovieForm() {
    const router = useRouter();

    const { mutate: createMovie, isPending: createPending } = useCreateMovie();
    const initialValues = {
        name: '',
        description: '',
        releaseDate: new Date(),
        duration: new Date(),
        publisher: '',
        country: '',
        language: '',
        poster: [],
        trailerUrl: '',
        genres: [],
        persons: [],
        status: MovieStatus.COMING_SOON,
    };

    const form = useForm<MovieFormData>({
        resolver: zodResolver(movieSchema),
        defaultValues: initialValues,
    });

    const onSubmit = (data: MovieFormData) => {
        const formData = convertToFormData<Omit<MovieFormData, 'duration'> & { duration: string }>({
            ...data,
            duration: data.duration.toTimeString().split(' ')[0],
        });

        createMovie(formData, {
            onSuccess: (res) => {
                if (res.result) {
                    queryClient.invalidateQueries({ queryKey: ['cinemas', {}] });
                    router.push('/admin/movie');
                    toast.success('Create cinema successfully', { richColors: true });
                    form.reset();
                }
            },
            onError: (error) => {
                toast.error(error.message, { richColors: true });
            },
        });
    };

    const onError = (data: FieldErrors) => {
        console.log(data);
    };

    return (
        <FormProvider {...form}>
            <form id="form-movie" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-2">
                <FieldGroup className="gap-3">
                    <BasicInfoSection />
                    <ProductionInfoSection />
                    <FileUploader name="poster" accept="image/*" />
                </FieldGroup>
                <GenresSection />
                <CastCrewSection />
                {/* Submit Button */}
                <Button type="submit">
                    {createPending && <LoaderCircle className="animate-spin" />}
                    {createPending ? 'Processing Creating...' : 'Save Changes'}
                </Button>
            </form>
        </FormProvider>
    );
}
