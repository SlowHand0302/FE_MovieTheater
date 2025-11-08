import { RoomType } from '@/interfaces/RoomType.interface';

// Hard-coded RoomType data
export const dummyRoomTypes: RoomType[] = [
    {
        id: 'rt-001',
        createdAt: new Date('2023-06-15T10:30:00Z'),
        updatedAt: new Date('2023-06-15T10:30:00Z'),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        isDeleted: false,
        type: 'Standard',
        basePrice: 50,
    },
    {
        id: 'rt-002',
        createdAt: new Date('2023-07-20T14:15:00Z'),
        updatedAt: new Date('2023-07-20T14:15:00Z'),
        createdBy: 'usr_002',
        updatedBy: 'usr_002',
        isDeleted: false,
        type: 'VIP',
        basePrice: 120,
    },
    {
        id: 'rt-003',
        createdAt: new Date('2023-08-10T09:00:00Z'),
        updatedAt: new Date('2023-08-10T09:00:00Z'),
        createdBy: 'usr_001',
        updatedBy: 'usr_001',
        isDeleted: false,
        type: 'IMAX',
        basePrice: 150,
    },
    {
        id: 'rt-004',
        createdAt: new Date('2023-09-05T16:45:00Z'),
        updatedAt: new Date('2024-01-12T11:20:00Z'),
        createdBy: 'usr_003',
        updatedBy: 'usr_004',
        isDeleted: true,
        type: '3D Deluxe',
        basePrice: 180,
    },
];
