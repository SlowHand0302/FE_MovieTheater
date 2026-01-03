'use client';
import * as z from 'zod';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, FieldErrors, Controller } from 'react-hook-form';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { FoodAndDrinkResultData } from '@/features/food-drink/DTOs/GetFoodAndDrink.dto';
import { useCreateFoodDrink, useUpdateFoodDrink } from '@/features/food-drink/mutations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { convertToFormData } from '@/lib/utils';
import { queryClient } from '@/lib/queryClient.config';

const foodDrinkFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    size: z.string().min(1, 'Size is required'),
    price: z.number().gt(0, 'Price must not be 0 or negative'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

const imageFileSchema = z
    .array(z.custom<File>())
    .max(2, 'Maximum 2 files allowed')
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
        message: 'File size must be less than 5MB',
    });

export const createFoodDrinkSchema = foodDrinkFormSchema.extend({
    imageFile: imageFileSchema.min(1, 'Image is required'),
});

export const updateFoodDrinkSchema = foodDrinkFormSchema.extend({
    imageFile: imageFileSchema.optional(),
});

type CreateInput = z.infer<typeof createFoodDrinkSchema>;
type UpdateInput = z.infer<typeof updateFoodDrinkSchema>;

interface FoodDrinkFormProps {
    foodDrinks?: FoodAndDrinkResultData;
    openForm: boolean;
    setOpenForm: (isOpen: boolean) => void;
}

const FoodDrinkForm = ({ foodDrinks, openForm, setOpenForm }: FoodDrinkFormProps) => {
    const [preview, setPreview] = useState<string | null>(null);

    const { mutate: createFoodDrink, isPending: createPending } = useCreateFoodDrink();
    const { mutate: updateFoodDrink, isPending: updatePending } = useUpdateFoodDrink();

    const initialValues = {
        name: '',
        type: '',
        size: '',
        price: 0,
        description: '',
        imageFile: [],
    };
    const schema = foodDrinks ? updateFoodDrinkSchema : createFoodDrinkSchema;
    const form = useForm<CreateInput | UpdateInput>({
        resolver: zodResolver(schema),
        defaultValues: initialValues,
    });
    const watchImage = form.watch('imageFile');

    const onSubmit = (data: CreateInput | UpdateInput) => {
        const formData = convertToFormData<
            Omit<FoodAndDrinkResultData, 'id' | 'image'> & { imageFile: File | undefined }
        >({
            ...data,
            imageFile: data.imageFile?.[0],
        });
        console.log(Object.fromEntries(formData.entries()));
        if (foodDrinks) {
            updateFoodDrink(
                { id: foodDrinks.id, data: formData },
                {
                    onSuccess: (res) => {
                        if (res.result) {
                            queryClient.invalidateQueries({ queryKey: ['foods-and-drinks'] });
                            toast.success('Update cinema successfully', { richColors: true });
                            setOpenForm(false);
                            form.reset();
                        }
                    },
                    onError: (error) => {
                        toast.error(error.message, { richColors: true });
                    },
                },
            );
        } else {
            createFoodDrink(formData, {
                onSuccess: (res) => {
                    if (res.result) {
                        queryClient.invalidateQueries({ queryKey: ['foods-and-drinks'] });
                        toast.success('Create food and drink successfully', { richColors: true });
                        setOpenForm(false);
                        form.reset();
                    }
                },
                onError: (error) => {
                    toast.error(error.message, { richColors: true });
                },
            });
        }
    };

    const onError = (error: FieldErrors) => {
        console.log(error);
    };

    useEffect(() => {
        if (!openForm && !foodDrinks) return;
        const defaultVal = foodDrinks
            ? {
                  ...foodDrinks,
                  imageFile: [],
              }
            : initialValues;
        form.reset(defaultVal);
        setPreview(foodDrinks?.image ?? null);
    }, [foodDrinks, openForm, form]);

    useEffect(() => {
        const file = form.getValues('imageFile')?.[0];
        if (!foodDrinks) {
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
            setPreview(foodDrinks.image);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchImage, foodDrinks]);

    return (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent className="max-w-[90vw] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{foodDrinks ? 'Edit this' : 'Create new'} food or drinks</DialogTitle>
                    <DialogDescription>
                        {foodDrinks ? 'Make changes to this food or drink' : 'Create new food or drink'} here. Click
                        save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form
                        id="form-cinema"
                        onSubmit={form.handleSubmit(onSubmit, onError)}
                        className="overflow-y-scroll p-1 max-h-[70vh] relative"
                    >
                        <FieldGroup className="gap-3">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="food-drink-name">Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id="food-drink-name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Aa..."
                                            autoComplete="off"
                                            disabled={updatePending || createPending}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <div className="flex md:gap-7 gap-3 flex-col md:flex-row">
                                <Controller
                                    name="type"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="gap-1">
                                            <FieldLabel htmlFor="food-drink-type">Type</FieldLabel>
                                            <Input
                                                {...field}
                                                id="food-drink-type"
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
                                    name="size"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="gap-1">
                                            <FieldLabel htmlFor="food-drink-size">Size</FieldLabel>
                                            <Select
                                                {...field}
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="food-drink-size"
                                                    aria-invalid={fieldState.invalid}
                                                    className="min-w-[120px] capitalize"
                                                >
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent position="item-aligned" align="end">
                                                    {Object.entries({
                                                        Kids: 'kids',
                                                        Small: 'small',
                                                        Medium: 'medium',
                                                        Large: 'large',
                                                        XL: 'xl',
                                                    }).map(([key, value]) => (
                                                        <SelectItem key={key} value={value} className="capitalize">
                                                            {value}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>
                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="food-drink-price">Price</FieldLabel>
                                        <Input
                                            {...field}
                                            id="food-drink-price"
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
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel htmlFor="food-drink-description">Description</FieldLabel>
                                        <Textarea
                                            {...field}
                                            id="food-drink-description"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Aa..."
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <div className="relative border-2 border-gray-200 rounded-lg p-4 flex justify-center items-center md:gap-7 gap-3 flex-col-reverse">
                                <FileUploader name="imageFile" accept="image/*" />
                                {preview && (
                                    <div className="space-y-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt="Preview" className=" h-95 rounded-xl object-cover" />
                                    </div>
                                )}
                            </div>
                            {/* <FileUploader name="imageFile" accept="image/*" /> */}
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
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default FoodDrinkForm;
