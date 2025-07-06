"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { simpleExplainerSchema } from '@/lib/schemas';
import { runGenerateExplanation } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import type { GenerateSimpleExplanationOutput } from '@/ai/flows/generate-simple-explanations';
import { Lightbulb, Wheat, Presentation } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

type FormData = z.infer<typeof simpleExplainerSchema>;

interface SimpleExplainerToolProps {
  onBack: () => void;
}

export function SimpleExplainerTool({ onBack }: SimpleExplainerToolProps) {
  const [result, setResult] = useState<GenerateSimpleExplanationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(simpleExplainerSchema),
    defaultValues: {
      question: '',
      gradeLevel: '5',
      language: 'English',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runGenerateExplanation(data);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate explanation. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formComponent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question to Explain</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Why is the sky blue?" {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gradeLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                   {[...Array(12)].map((_, i) => <SelectItem key={i+1} value={String(i + 1)}>Grade {i + 1}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Marathi, English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Explanation'}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result ? (
    <div className="space-y-6">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 mt-1 text-primary" />
            <div>
                <h3 className="font-headline mt-0">Simple Explanation</h3>
                <p className="whitespace-pre-wrap">{result.explanation}</p>
            </div>
        </div>
        <Separator className="my-4"/>
        <div className="flex items-start gap-3">
            <Wheat className="h-5 w-5 mt-1 text-primary" />
             <div>
                <h3 className="font-headline mt-0">Real-life Analogy</h3>
                <p className="whitespace-pre-wrap">{result.analogySuggestion}</p>
            </div>
        </div>
         <Separator className="my-4"/>
        <div className="flex items-start gap-3">
            <Presentation className="h-5 w-5 mt-1 text-primary" />
             <div>
                <h3 className="font-headline mt-0">Chalkboard Suggestion</h3>
                <p className="whitespace-pre-wrap">{result.chalkboardDrawingSuggestion}</p>
            </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <ToolView
      title="Simple Explainer"
      description="Explain complex topics with simple, real-life analogies."
      form={formComponent}
      result={resultComponent}
      isLoading={isLoading}
      onBack={onBack}
    />
  );
}
