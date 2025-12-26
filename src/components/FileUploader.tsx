import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from './ui/file-upload';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';

interface FileUploaderProps {
    name: string;
    label?: string;
    description?: string;
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
}

export function FileUploader({
    name,
    label,
    description,
    accept = 'image/*',
    maxSize = 5,
    maxFiles = 1,
}: FileUploaderProps) {
    const { control, setError, clearErrors } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const handleValueChange = (files: File[] | null) => {
                    // Clear any previous errors when files change
                    clearErrors(name);
                    field.onChange(files);
                };

                const handleFileReject = (_: File, message: string) => {
                    setError(name, {
                        type: 'custom',
                        message: message,
                    });
                };

                return (
                    <Field data-invalid={fieldState.invalid} className="pt-1 gap-1">
                        <FieldLabel className="capitalize">{label ?? name}</FieldLabel>
                        <FileUpload
                            value={field.value || []}
                            onValueChange={handleValueChange}
                            accept={accept}
                            maxFiles={maxFiles}
                            maxSize={maxSize * 1024 * 1024}
                            onFileReject={handleFileReject}
                            multiple={maxFiles > 1}
                        >
                            <FileUploadDropzone aria-invalid={fieldState.invalid}>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center justify-center rounded-full border p-2.5">
                                        <Upload className="size-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium text-sm">Drag & drop files here</p>
                                    <p className="text-muted-foreground text-xs">
                                        Or click to browse (max {maxFiles} file{maxFiles > 1 ? 's' : ''}, up to{' '}
                                        {maxSize}MB each)
                                    </p>
                                </div>
                                <FileUploadTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                                        Browse files
                                    </Button>
                                </FileUploadTrigger>
                            </FileUploadDropzone>
                            <FileUploadList>
                                {Array.isArray(field.value) &&
                                    field.value.map((file, index) => (
                                        <FileUploadItem key={index} value={file}>
                                            <FileUploadItemPreview />
                                            <FileUploadItemMetadata />
                                            <FileUploadItemDelete asChild>
                                                <Button variant="ghost" size="icon" className="size-7">
                                                    <X />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </FileUploadItemDelete>
                                        </FileUploadItem>
                                    ))}
                            </FileUploadList>
                        </FileUpload>
                        {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                        {description && <FieldDescription>{description}</FieldDescription>}
                    </Field>
                );
            }}
        />
    );
}
