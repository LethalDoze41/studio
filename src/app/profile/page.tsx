'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import UpdateProfileForm from '@/components/profile/UpdateProfileForm';
import UpdatePasswordForm from '@/components/profile/UpdatePasswordForm';
import SavedRecipes from '@/components/profile/SavedRecipes';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };
  
  if (loading) {
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
                <Skeleton className="md:col-span-1 h-64" />
                <Skeleton className="md:col-span-2 h-64" />
            </div>
            <Skeleton className="h-96" />
        </div>
    )
  }

  if (!user || !userProfile) return null;

  return (
    <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Your Profile</h1>
        <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20 border-2 border-primary">
                            <AvatarImage src={user.photoURL || userProfile.photoURL || ''} alt={userProfile.displayName || ''} />
                            <AvatarFallback className="text-2xl">{getInitials(userProfile.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xl font-bold">{userProfile.displayName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                        Member since: {format(userProfile.createdAt.toDate(), 'MMMM yyyy')}
                        </p>
                    </CardContent>
                </Card>

                 <Card id="settings">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <UpdateProfileForm userProfile={userProfile} />
                        <UpdatePasswordForm />
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-2">
                 <SavedRecipes userId={user.uid} />
            </div>
        </div>
    </div>
  );
}
