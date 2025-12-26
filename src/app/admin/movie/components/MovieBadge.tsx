import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MovieStatus } from '@/interfaces/Movie.interface';
import { cn } from '@/lib/utils';

interface MovieBadgeProps extends React.ComponentProps<typeof Badge> {
    status: MovieStatus;
}

const MovieBadge = ({ status, className, ...props }: MovieBadgeProps) => {
    switch (status.toLowerCase()) {
        case 'showing':
            return (
                <Badge {...props} className={cn('bg-green-500 text-white hover:bg-green-600', className)}>
                    {status}
                </Badge>
            );
        case 'coming_soon':
            return (
                <Badge {...props} variant="secondary" className={cn(className)}>
                    {status}
                </Badge>
            );
        case 'stopped':
            return (
                <Badge {...props} variant="destructive" className={cn(className)}>
                    {status}
                </Badge>
            );
        default:
            return <Badge {...props}>{status}</Badge>;
    }
};

export default MovieBadge;
