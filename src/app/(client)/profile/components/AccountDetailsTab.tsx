import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { User } from '@/interfaces/User.interface';
import { Badge } from '@/components/ui/badge';

interface AccountDetailsTab {
    user: Omit<User, 'password' | 'createdBy' | 'isDeleted' | 'updatedBy'>;
}

const AccountDetailsTab = ({ user }: AccountDetailsTab) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Information about your account status and history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                            <p className="font-mono text-sm">{user.id}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Role</p>
                            <Badge variant="outline" className="capitalize">
                                {user.role}
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Member Since
                            </p>
                            <p className="text-sm">{formatDate(user.createdAt)}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Last Updated
                            </p>
                            <p className="text-sm">{formatDate(user.updatedAt)}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-2 w-2 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}
                                />
                                <p className="text-sm">
                                    {user.isVerified ? 'Verified Account' : 'Pending Verification'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                            <Badge variant="default">Active</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Password</p>
                            <p className="text-sm text-muted-foreground">Last changed 2 months ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                            Change Password
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm">
                            Enable
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default AccountDetailsTab;
