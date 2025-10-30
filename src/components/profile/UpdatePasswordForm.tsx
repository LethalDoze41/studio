'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useState } from 'react';
import { updatePassword, getAuth } from 'firebase/auth';

import { UpdatePasswordSchema } from '@/lib/schemas';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/Spinner';

type FormValues = z.infer<typeof UpdatePasswordSchema>;

export default function UpdatePasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const auth = getAuth(app);
    if (!auth.currentUser) {
        toast({ variant: 'destructive', title: 'Not authenticated' });
        return;
    }
    const user = auth.currentUser;

    setIsLoading(true);
    try {
      await updatePassword(user, data.newPassword);
      toast({ title: 'Password Updated!', description: "Your password has been changed successfully." });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <h3 className="text-lg font-medium">Change Password</h3>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" variant="secondary" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2" />}
                Update Password
            </Button>
            </form>
        </Form>
    </div>
  );
}
