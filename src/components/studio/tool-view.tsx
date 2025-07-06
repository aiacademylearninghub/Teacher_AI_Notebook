import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolViewProps {
  title: string;
  description: string;
  form: React.ReactNode;
  result: React.ReactNode;
  isLoading: boolean;
  onBack: () => void;
}

export function ToolView({ title, description, form, result, isLoading, onBack }: ToolViewProps) {
  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="space-y-6 overflow-y-auto pr-4">{form}</div>
        <div className="flex flex-col min-h-0">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <Card className="flex-1 bg-background">
            <CardContent className="p-4 h-full overflow-y-auto">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                result || <div className="flex h-full min-h-[250px] items-center justify-center text-center text-muted-foreground"><p>Your generated content will appear here.</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
