'use client';

import ConfirmDialog from '@/components/ConfirmDialog';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

interface ConfirmContextValue {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error('useConfirm must be used in ConfirmProvider');
    return context.confirm;
};

interface ConfirmProviderProps {
    children: ReactNode;
}

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
    const [state, setState] = useState<(ConfirmOptions & { resolve?: (v: boolean) => void }) | null>(null);

    const confirm = (options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            setState({ ...options, resolve });
        });
    };

    const handleClose = (value: boolean) => {
        state?.resolve?.(value);
        setState(null);
    };

    return (
        <ConfirmContext value={{ confirm }}>
            {children}
            <ConfirmDialog
                open={!!state}
                title={state?.title}
                description={state?.description}
                confirmText={state?.confirmText}
                cancelText={state?.cancelText}
                onConfirm={() => handleClose(true)}
                onCancel={() => handleClose(false)}
            />
        </ConfirmContext>
    );
};
