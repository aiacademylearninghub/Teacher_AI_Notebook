import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolViewProps {
  title: string;
  description: string;
  onBack: () => void;
  form: React.ReactNode;
  result: React.ReactNode;
  isLoading: boolean;
}

export function ToolView({ title, description, onBack, form, result, isLoading }: ToolViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tools
        </Button>
        <h1 className="font-headline text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">{form}</div>
        <div className="lg:col-span-3">
          <Card className="min-h-[400px]">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                result || <div className="flex h-full min-h-[350px] items-center justify-center text-center text-muted-foreground"><p>Your generated content will appear here.</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
