'use client';
import React, { useEffect, useState } from 'react';
import { MovieFormData } from '../../components/form/MovieForm';
import { useParams } from 'next/navigation';
import { useMovieById } from '@/features/movie/queries';
import { MovieBaseResultData } from '@/features/movie/DTOs/GetMovie.dto';
import { movieSchema } from '../../components/form/MovieForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { FileUploader } from '@/components/FileUploader';
import BasicInfoSection from '../../components/form/BasicInfoSection';
import CastCrewSection from '../../components/form/CastCrewSection';
import GenresSection from '../../components/form/GenresSection';
import ProductionInfoSection from '../../components/form/ProductionInfoSection';
import { MovieStatus } from '@/interfaces/Movie.interface';
import { parse } from 'date-fns';

export default function Page() {
    const { movieId } = useParams<{ movieId: string }>();
    const { data, isPending, isError, error } = useMovieById(movieId);
    const movie = data as MovieBaseResultData;
    const [preview, setPreview] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const form = useForm<MovieFormData>({
        resolver: zodResolver(movieSchema),
        defaultValues: {
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
        },
    });
    const watchPoster = form.watch('poster');

    const onSubmit = (data: MovieFormData) => {
        // const formData = convertToFormData<Omit<MovieFormData, 'duration'> & { duration: string }>({
        //     ...data,
        //     duration: data.duration.toTimeString().split(' ')[0],
        // });
        console.log(data);

        // console.log(Object.entries(formData).entries());
    };

    const onError = (data: FieldErrors) => {
        console.log(data);
    };

    useEffect(() => {
        if (!movieId || !movie || isInitialized) {
            return;
        }
        const defaultVal = movie
            ? {
                  ...movie,
                  poster: [],
                  releaseDate: new Date(movie.releaseDate),
                  duration: parse(movie.duration, 'HH:mm:ss', new Date()),
                  genres: [...movie.genres.map((genre) => ({ genreId: genre.genreId }))],
                  persons: [...movie.persons.map((person) => ({ personId: person.personId, role: person.role }))],
              }
            : {};
        setIsInitialized(true);
        setPreview(movie.poster);
        form.reset(defaultVal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movie, movieId, isInitialized]);

    useEffect(() => {
        const file = form.getValues('poster')[0];
        if (!movieId || !movie) {
            return;
        }
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        } else {
            setPreview(movie.poster);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchPoster, movie, movieId]);

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>{error.message}</div>;

    return (
        <div className="p-8 pt-2">
            <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-2">Edit Movie</h2>
            <FormProvider {...form}>
                <form id="form-movie" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-2">
                    <FieldGroup className="gap-3">
                        <BasicInfoSection />
                        <ProductionInfoSection />
                        <div className="relative border-2 border-gray-200 rounded-lg p-4 flex md:gap-7 gap-3 flex-col md:flex-row-reverse">
                            <FileUploader name="poster" accept="image/*" />
                            {preview && (
                                <div className="space-y-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={preview} alt="Preview" className=" w-76 rounded-xl object-cover" />
                                </div>
                            )}
                        </div>
                    </FieldGroup>
                    <GenresSection />
                    <CastCrewSection />
                    {/* Submit Button */}
                    <Button type="submit">Save Changes</Button>
                </form>
            </FormProvider>{' '}
        </div>
    );
}
