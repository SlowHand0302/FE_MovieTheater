import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RoomStatus } from '@/interfaces/Room.interface';

interface RoomBadgeProps extends React.ComponentProps<typeof Badge> {
    status: RoomStatus;
}

const RoomBadge = ({ status, ...props }: RoomBadgeProps) => {
    switch (status) {
        case 'active':
            return (
                <Badge {...props} className="bg-green-500 text-white hover:bg-green-600">
                    {status}
                </Badge>
            );
        case 'inactive':
            return (
                <Badge {...props} variant="secondary">
                    {status}
                </Badge>
            );
        case 'closed':
            return (
                <Badge {...props} variant="destructive">
                    {status}
                </Badge>
            );
        case 'maintenance':
            return (
                <Badge {...props} className="bg-yellow-500 text-white hover:bg-yellow-600 ">
                    {status}
                </Badge>
            );
        default:
            return <Badge {...props}>{status}</Badge>;
    }
};

export default RoomBadge;
