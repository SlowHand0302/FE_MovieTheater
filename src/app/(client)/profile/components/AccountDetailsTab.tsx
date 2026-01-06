import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/features/auth/useAuthStore';

const AccountDetailsTab = () => {
    const { user } = useAuthStore();
    let formatted;
    if (user) {
        formatted = { ...user, id: Object.entries(user).find(([key, _]) => key === 'userId')?.[1] };
    }

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
                            <p className="font-mono text-sm">{formatted?.id || 'Updating...'}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Role</p>
                            <Badge variant="outline" className="capitalize">
                                {formatted?.role || 'Updating...'}
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Member Since
                            </p>
                            <p className="text-sm">
                                {formatted?.createdAt ? formatDate(formatted.createdAt) : 'Updating...'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Last Updated
                            </p>
                            <p className="text-sm">
                                {formatted?.updatedAt ? formatDate(formatted.updatedAt) : 'Updating...'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-2 w-2 rounded-full ${formatted?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}
                                />
                                <p className="text-sm">
                                    {formatted?.isVerified ? 'Verified Account' : 'Pending Verification'}
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
