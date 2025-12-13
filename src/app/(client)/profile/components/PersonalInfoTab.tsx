import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, MapPin, Award, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import ProfileForm from './ProfileForm';
import { useAuthStore } from '@/features/auth/useAuthStore';

const PersonalInfoTab = () => {
    const { user } = useAuthStore();
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
    const userPoints = user?.points || 0;

    const getLoyaltyTier = (points: number) => {
        if (points >= 5000) return { name: 'Platinum', color: 'bg-slate-900 text-white' };
        if (points >= 2500) return { name: 'Gold', color: 'bg-yellow-600 text-white' };
        if (points >= 1000) return { name: 'Silver', color: 'bg-slate-400 text-white' };
        return { name: 'Bronze', color: 'bg-amber-700 text-white' };
    };

    const tier = getLoyaltyTier(user?.points || 0);

    return (
        <>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your personal details and contact information</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setOpenFormDialog(true)}>
                        <Edit2 className="sm:mr-2 mr-0 h-4 w-4" />
                        <p className="sm:block hidden">Edit Profile</p>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="fullname" value={user?.fullName} disabled={true} className="pl-10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={user?.email ? user.email : 'Updating...'}
                                    disabled={true}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={user?.phoneNumber ? user.phoneNumber : 'Updating...'}
                                    disabled={true}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="dob"
                                    value={
                                        user?.dayOfBirth
                                            ? new Date(user.dayOfBirth).toISOString().split('T')[0]
                                            : 'Updating...'
                                    }
                                    disabled={true}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Input
                                id="gender"
                                value={user?.gender ? user.gender : 'Updating...'}
                                disabled={true}
                                className="capitalize"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="address"
                                value={user?.address ? user.address : 'Updating...'}
                                disabled={true}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Loyalty Program</CardTitle>
                    <CardDescription>Track your rewards and benefits</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Award className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-medium">Current Tier: {tier.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {userPoints >= 5000
                                            ? 'You are at the highest tier!'
                                            : `${(tier.name === 'Gold' ? 5000 : tier.name === 'Silver' ? 2500 : 1000) - userPoints} points to next tier`}
                                    </p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold">{user?.points}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>
                                    Progress to{' '}
                                    {tier.name === 'Platinum'
                                        ? 'Platinum (Max)'
                                        : tier.name === 'Gold'
                                          ? 'Platinum'
                                          : tier.name === 'Silver'
                                            ? 'Gold'
                                            : 'Silver'}
                                </span>
                                <span>
                                    {userPoints >= 5000
                                        ? '100%'
                                        : `${Math.round((userPoints / (tier.name === 'Gold' ? 5000 : tier.name === 'Silver' ? 2500 : 1000)) * 100)}%`}
                                </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{
                                        width: `${userPoints >= 5000 ? 100 : Math.min((userPoints / (tier.name === 'Gold' ? 5000 : tier.name === 'Silver' ? 2500 : 1000)) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ProfileForm openForm={openFormDialog} setOpenForm={setOpenFormDialog} />
        </>
    );
};

export default PersonalInfoTab;
