'use client';

import React from 'react';

import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import HistoryTab from './components/HistoryTab';
import PersonalInfoTab from './components/PersonalInfoTab';
import AccountDetailsTab from './components/AccountDetailsTab';
import { useAuthStore } from '@/features/auth/useAuthStore';

export default function CustomerProfile() {
    const { user: userData } = useAuthStore();

    const getLoyaltyTier = (points: number) => {
        if (points >= 5000) return { name: 'Platinum', color: 'bg-slate-900 text-white' };
        if (points >= 2500) return { name: 'Gold', color: 'bg-yellow-600 text-white' };
        if (points >= 1000) return { name: 'Silver', color: 'bg-slate-400 text-white' };
        return { name: 'Bronze', color: 'bg-amber-700 text-white' };
    };

    const tier = getLoyaltyTier(userData?.points || 0);

    if (!userData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background mt-20">
            <div className=" mx-auto space-y-6">
                {/* Loyalty Status Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-5 sm:flex-row flex-col">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{userData?.fullName}</CardTitle>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={userData?.isVerified ? 'default' : 'secondary'}>
                                            {userData?.isVerified ? 'Verified' : 'Unverified'}
                                        </Badge>
                                        <Badge className={tier.color}>{tier.name} Member</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex items-center sm:gap-0 gap-5 sm:flex-col flex-row">
                                <p className="sm:text-sm text-xl text-muted-foreground">Reward Points:</p>
                                <p className="text-3xl font-bold text-primary">
                                    {userData?.points?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Main Content Tabs */}
                <Tabs defaultValue="personal" className="space-y-4">
                    <TabsList className=" flex w-full gap-2 overflow-x-auto justify-start">
                        <TabsTrigger value="personal" className="flex-shrink-0">
                            Personal Information
                        </TabsTrigger>

                        <TabsTrigger value="tickets" className="flex-shrink-0">
                            Tickets & History
                        </TabsTrigger>

                        <TabsTrigger value="account" className="flex-shrink-0">
                            Account Details
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-4">
                        <PersonalInfoTab />
                    </TabsContent>

                    <TabsContent value="tickets" className="space-y-4">
                        <HistoryTab />
                    </TabsContent>

                    <TabsContent value="account" className="space-y-4">
                        <AccountDetailsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
