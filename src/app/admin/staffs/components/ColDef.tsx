'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import SortableHeader from '@/components/data-table/SortableHeader';
import { CircleCheckBig, CircleX, Copy, FileText, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import User, { Staff } from '@/interfaces/User.interface';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface useStaffColumnsParams {
    onCopyId: (id: string) => void;
    onViewDetails: (staff: Staff) => void;
    onEdit: (staff: Staff) => void;
    onDelete: (staff: Staff) => void;
}

export const useStaffColumns = ({ onEdit, onViewDetails, onDelete, onCopyId }: Partial<useStaffColumnsParams> = {}) => {
    return useMemo<ColumnDef<Staff, unknown>[]>(
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
                    <div>{row.original.dayOfBirth ? row.original.dayOfBirth.toString() : 'Updating...'}</div>
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
                accessorKey: 'position',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Position</SortableHeader>;
                },
                cell: ({ row }) => <div>{row.original.position ? row.original.position : 'Updating...'}</div>,
            },
            {
                accessorKey: 'salary',
                header: ({ column }) => {
                    return <SortableHeader column={column}>Salary</SortableHeader>;
                },
                cell: ({ row }) => <div>{row.original.salary ? row.original.salary : 0}</div>,
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
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const staff = row.original;

                    return (
                        <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 ">
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(staff.id)}>
                                        <Copy />
                                        Copy ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onViewDetails && onViewDetails(staff)}>
                                        <FileText /> View details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => onEdit && onEdit(staff)}>
                                        <SquarePen /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => onDelete && onDelete(staff)}>
                                        <Trash2 /> Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [onEdit, onViewDetails, onDelete, onCopyId],
    );
};
