import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

interface AuthFormCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthFormCard({ title, description, children }: AuthFormCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <Leaf className="h-10 w-10 text-primary"/>
        </div>
        <CardTitle className="text-2xl font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
