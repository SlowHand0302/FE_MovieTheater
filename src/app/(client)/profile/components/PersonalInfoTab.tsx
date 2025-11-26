import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { User as IUser } from '@/interfaces/User.interface';

interface PersonalInfoTabProps {
    user: Omit<IUser, 'password' | 'createdBy' | 'isDeleted' | 'updatedBy'>;
}

const PersonalInfoTab = ({ user }: PersonalInfoTabProps) => {
    const getLoyaltyTier = (points: number) => {
        if (points >= 5000) return { name: 'Platinum', color: 'bg-slate-900 text-white' };
        if (points >= 2500) return { name: 'Gold', color: 'bg-yellow-600 text-white' };
        if (points >= 1000) return { name: 'Silver', color: 'bg-slate-400 text-white' };
        return { name: 'Bronze', color: 'bg-amber-700 text-white' };
    };

    const tier = getLoyaltyTier(user.point);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="fullname" value={user.fullname} disabled={true} className="pl-10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="email" type="email" value={user.email} disabled={true} className="pl-10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="phone" value={user.phoneNumber} disabled={true} className="pl-10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="dob"
                                    type="date"
                                    value={new Date(user.dayOfBirth).toISOString().split('T')[0]}
                                    disabled={true}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Input id="gender" value={user.gender} disabled={true} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="address" value={user.address} disabled={true} className="pl-10" />
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
                                        {user.point >= 5000
                                            ? 'You are at the highest tier!'
                                            : `${(tier.name === 'Gold' ? 5000 : tier.name === 'Silver' ? 2500 : 1000) - user.point} points to next tier`}
                                    </p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold">{user.point}</p>
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
                                    {user.point >= 5000
                                        ? '100%'
                                        : `${Math.round((user.point / (tier.name === 'Gold' ? 5000 : tier.name === 'Silver' ? 2500 : 1000)) * 100)}%`}
                                </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{
                                        width: `${user.point >= 5000 ? 100 : Math.min((user.point / (tier.name === 'Gold' ? 5000 : tier.name === 'Silver' ? 2500 : 1000)) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default PersonalInfoTab;
