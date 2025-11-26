'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Award,
    Clock,
    Edit2,
    Save,
    X,
    Ticket,
    CreditCard,
    Download,
} from 'lucide-react';
import PersonalInfoTab from './components/PersonalInfoTab';
import { User as IUser } from '@/interfaces/User.interface';
import HistoryTab from './components/HistoryTab';
import AccountDetailsTab from './components/AccountDetailsTab';

// Mock user data based on your interface
const mockUser: Omit<IUser, 'password' | 'createdBy' | 'isDeleted' | 'updatedBy'> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    fullname: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phoneNumber: '+1 (555) 123-4567',
    dayOfBirth: new Date('1990-05-15'),
    gender: 'Female',
    point: 2850,
    address: '123 Broadway Street, New York, NY 10001',
    role: 'customer',
    isVerified: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-11-20'),
};

// Mock ticket purchase history
const mockTicketHistory = [
    {
        id: 'TKT-001',
        movieTitle: 'Oppenheimer',
        showDate: new Date('2024-11-20T19:30:00'),
        theater: 'Screen 1',
        seats: ['A12', 'A13'],
        totalAmount: 32.0,
        paymentMethod: 'Credit Card',
        status: 'completed',
        bookingDate: new Date('2024-11-18'),
        pointsEarned: 32,
    },
    {
        id: 'TKT-002',
        movieTitle: 'Barbie',
        showDate: new Date('2024-11-10T15:00:00'),
        theater: 'Screen 3',
        seats: ['D5', 'D6', 'D7'],
        totalAmount: 48.0,
        paymentMethod: 'Debit Card',
        status: 'completed',
        bookingDate: new Date('2024-11-08'),
        pointsEarned: 48,
    },
    {
        id: 'TKT-003',
        movieTitle: 'Dune: Part Two',
        showDate: new Date('2024-12-05T20:00:00'),
        theater: 'Screen 2 - IMAX',
        seats: ['F10', 'F11'],
        totalAmount: 42.0,
        paymentMethod: 'Credit Card',
        status: 'upcoming',
        bookingDate: new Date('2024-11-22'),
        pointsEarned: 42,
    },
    {
        id: 'TKT-004',
        movieTitle: 'The Holdovers',
        showDate: new Date('2024-10-28T18:30:00'),
        theater: 'Screen 4',
        seats: ['B8'],
        totalAmount: 16.0,
        paymentMethod: 'Points Redemption',
        status: 'completed',
        bookingDate: new Date('2024-10-25'),
        pointsEarned: 0,
    },
    {
        id: 'TKT-005',
        movieTitle: 'Poor Things',
        showDate: new Date('2024-10-15T21:00:00'),
        theater: 'Screen 1',
        seats: ['C15', 'C16'],
        totalAmount: 34.0,
        paymentMethod: 'Credit Card',
        status: 'completed',
        bookingDate: new Date('2024-10-12'),
        pointsEarned: 34,
    },
];

export default function CustomerProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(mockUser);
    const [editedData, setEditedData] = useState(mockUser);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedData(userData);
    };

    const handleSave = () => {
        setUserData(editedData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedData(userData);
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: unknown) => {
        setEditedData({ ...editedData, [field]: value });
    };

    const getLoyaltyTier = (points: number) => {
        if (points >= 5000) return { name: 'Platinum', color: 'bg-slate-900 text-white' };
        if (points >= 2500) return { name: 'Gold', color: 'bg-yellow-600 text-white' };
        if (points >= 1000) return { name: 'Silver', color: 'bg-slate-400 text-white' };
        return { name: 'Bronze', color: 'bg-amber-700 text-white' };
    };

    const tier = getLoyaltyTier(userData.point);

    return (
        <div className="min-h-screen bg-background p-4 mt-20">
            <div className=" mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
                    </div>
                    {!isEditing ? (
                        <Button onClick={handleEdit} variant="outline">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={handleSave} size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </Button>
                            <Button onClick={handleCancel} variant="outline" size="sm">
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {/* Loyalty Status Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{userData.fullname}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={userData.isVerified ? 'default' : 'secondary'}>
                                            {userData.isVerified ? 'Verified' : 'Unverified'}
                                        </Badge>
                                        <Badge className={tier.color}>{tier.name} Member</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Reward Points</p>
                                <p className="text-3xl font-bold text-primary">{userData.point.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Main Content Tabs */}
                <Tabs defaultValue="personal" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">Personal Information</TabsTrigger>
                        <TabsTrigger value="tickets">Tickets & History</TabsTrigger>
                        <TabsTrigger value="account">Account Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                        <PersonalInfoTab user={mockUser} />
                    </TabsContent>

                    <TabsContent value="tickets" className="space-y-4">
                        <HistoryTab />
                    </TabsContent>

                    <TabsContent value="account" className="space-y-4">
                        <AccountDetailsTab user={mockUser} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
