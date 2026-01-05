'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import SortableHeader from '@/components/data-table/SortableHeader';
import { CircleCheckBig, CircleX } from 'lucide-react';
import User from '@/interfaces/User.interface';

interface useCustomerColumnsParams {
    onCopyId: (id: string) => void;
    onViewDetails: (customer: User) => void;
    onEdit: (customer: User) => void;
    onDelete: (customer: User) => void;
}

export const useCustomerColumns = ({
    onEdit,
    onViewDetails,
    onDelete,
    onCopyId,
}: Partial<useCustomerColumnsParams> = {}) => {
    return useMemo<ColumnDef<User, unknown>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'fullName',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Full Name</SortableHeader>;
                },
                cell: ({ row }) => <div>{row.original.fullName ? row.original.fullName : 'Updating...'}</div>,
            },
            {
                accessorKey: 'email',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Email</SortableHeader>;
                },
                cell: ({ row }) => <div>{row.original.email ? row.original.email : 'Updating...'}</div>,
            },
            {
                accessorKey: 'phoneNumber',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Phone Number</SortableHeader>;
                },
                cell: ({ row }) => <div>{row.original.phoneNumber ? row.original.phoneNumber : 'Updating...'}</div>,
            },
            {
                accessorKey: 'dayOfBirth',
                header: ({ column }) => {
                    return <SortableHeader column={column}>BirthDay</SortableHeader>;
                },
                cell: ({ row }) => (
                    <div>{row.original.dayOfBirth ? row.original.dayOfBirth.toLocaleDateString() : 'Updating...'}</div>
                ),
            },
            {
                accessorKey: 'gender',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Gender</SortableHeader>;
                },
                cell: ({ row }) => <div>{row.original.gender ? row.original.gender : 'Updating...'}</div>,
            },
            {
                accessorKey: 'point',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Point</SortableHeader>;
                },
                cell: ({ row }) => <div>{row.original.points ? row.original.points : 0}</div>,
            },
            {
                accessorKey: 'isVerified',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Is Verified</SortableHeader>;
                },
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <div className="max-w-sm line-clamp-1 truncate">
                            {user.isVerified ? (
                                <CircleCheckBig className="bg-green-500 size-6 text-white hover:bg-green-600 rounded-full" />
                            ) : (
                                <CircleX className="bg-red-500 size-6 text-white hover:bg-red-600 rounded-full" />
                            )}
                        </div>
                    );
                },
            },
        ],
        [onEdit, onViewDetails, onDelete, onCopyId],
    );
};
