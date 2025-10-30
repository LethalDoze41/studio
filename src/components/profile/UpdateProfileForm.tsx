'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useState } from 'react';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

import { UpdateProfileSchema } from '@/lib/schemas';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/Spinner';
import type { UserProfile } from '@/lib/types';

type FormValues = z.infer<typeof UpdateProfileSchema>;

interface UpdateProfileFormProps {
    userProfile: UserProfile;
}

export default function UpdateProfileForm({ userProfile }: UpdateProfileFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const user = auth.currentUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      displayName: userProfile.displayName || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not authenticated' });
        return;
    }

    setIsLoading(true);
    try {
      await updateAuthProfile(user, { displayName: data.displayName });
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { displayName: data.displayName });
      
      toast({ title: 'Profile Updated!', description: "Your name has been successfully updated." });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <h3 className="text-lg font-medium">Update Profile</h3>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2" />}
                Save Changes
            </Button>
            </form>
        </Form>
    </div>
  );
}
