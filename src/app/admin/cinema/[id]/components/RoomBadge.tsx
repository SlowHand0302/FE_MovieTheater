import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RoomStatus } from '@/interfaces/Room.interface';

import { cn } from '@/lib/utils';
interface RoomBadgeProps extends React.ComponentProps<typeof Badge> {
    status: RoomStatus;
}

const RoomBadge = ({ status, className, ...props }: RoomBadgeProps) => {
    switch (status.toLowerCase()) {
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
            return (
                <Badge {...props} className={cn(className)}>
                    {status}
                </Badge>
            );
    }
};

export default RoomBadge;
