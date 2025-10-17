import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface OverlayProps {
    children: ReactNode;
    onClick?: () => void;
    classname?: string;
}

function Overlay({ children, onClick, classname }: OverlayProps) {
    return (
        <div
            className={cn(
                'fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 w-screen h-screen z-[998] backdrop-blur-xs select-none',
                classname,
            )}
            onClick={onClick}
        >
            <div className="w-fit h-fit" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Overlay;
