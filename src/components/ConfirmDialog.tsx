import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialog {
    open?: boolean;
    title?: string;
    cancelText?: string;
    description?: string;
    confirmText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
}

export default function ConfirmDialog({
    open,
    cancelText = 'Cancel',
    confirmText = 'Continue',
    title = 'Are you absolutely sure?',
    description = 'This action cannot be undone. This will permanently delete this data from the servers.',
    onCancel,
    onConfirm,
}: ConfirmDialog) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel && onCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onCancel}>
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <Button onClick={onConfirm}>{confirmText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
