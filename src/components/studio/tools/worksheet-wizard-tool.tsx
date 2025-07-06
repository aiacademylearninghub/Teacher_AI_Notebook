"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { worksheetWizardSchema } from '@/lib/schemas';
import { runGenerateWorksheets } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import type { GenerateDifferentiatedWorksheetsOutput } from '@/ai/flows/generate-differentiated-worksheets';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

type FormData = z.infer<typeof worksheetWizardSchema>;

export function WorksheetWizardTool() {
  const [result, setResult] = useState<GenerateDifferentiatedWorksheetsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(worksheetWizardSchema),
    defaultValues: {
      lessonText: '',
      gradeLevel: '5',
      language: 'English',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runGenerateWorksheets(data);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate worksheet. Please try again.",
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
          name="lessonText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Text</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Photosynthesis is the process by which green plants use sunlight to synthesize foods..." {...field} rows={8} />
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
                <Input placeholder="e.g., Hindi, English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Worksheet'}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result ? (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
        <h3>Comprehension Questions</h3>
        <p>{result.comprehensionQuestions}</p>
        <Separator className="my-4" />
        <h3>Vocabulary Tasks</h3>
        <p>{result.vocabularyTasks}</p>
        <Separator className="my-4" />
        <h3>Creative Tasks</h3>
        <p>{result.creativeTasks}</p>
      </div>
    </div>
  ) : null;

  return (
    <ToolView
      title="Worksheet Wizard"
      description="Create differentiated worksheets from any lesson text."
      form={formComponent}
      result={resultComponent}
      isLoading={isLoading}
    />
  );
}
