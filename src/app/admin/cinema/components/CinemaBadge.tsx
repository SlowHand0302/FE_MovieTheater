import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CinemaStatus } from '@/interfaces/Cinema.interface';
import { cn } from '@/lib/utils';

interface CinemaBadgeProps extends React.ComponentProps<typeof Badge> {
    status: CinemaStatus;
}

const CinemaBadge = ({ status, className, ...props }: CinemaBadgeProps) => {
    switch (status) {
        case 'active':
            return (
                <Badge {...props} className={cn('bg-green-500 text-white hover:bg-green-600', className)}>
                    {status}
                </Badge>
            );
        case 'inactive':
            return (
                <Badge {...props} variant="secondary" className={cn(className)}>
                    {status}
                </Badge>
            );
        case 'closed':
            return (
                <Badge {...props} variant="destructive" className={cn(className)}>
                    {status}
                </Badge>
            );
        case 'maintenance':
            return (
                <Badge {...props} className={cn('bg-yellow-500 text-white hover:bg-yellow-600', className)}>
                    {status}
                </Badge>
            );
        default:
            return <Badge {...props}>{status}</Badge>;
    }
};

export default CinemaBadge;
