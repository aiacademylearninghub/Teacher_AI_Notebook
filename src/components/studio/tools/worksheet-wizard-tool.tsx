"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { worksheetWizardSchema } from '@/lib/schemas';
import { runGenerateStudyMaterials } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import type { GenerateStudyMaterialsOutput } from '@/ai/flows/generate-differentiated-worksheets';
import { Input } from '@/components/ui/input';

type FormData = z.infer<typeof worksheetWizardSchema>;

const taskTypes = [
    "Differentiated Worksheet",
    "Mock Question Paper",
    "Interview Preparation",
    "Key Concepts Summary",
];

interface WorksheetWizardToolProps {
  onBack: () => void;
}

export function WorksheetWizardTool({ onBack }: WorksheetWizardToolProps) {
  const [result, setResult] = useState<GenerateStudyMaterialsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(worksheetWizardSchema),
    defaultValues: {
      lessonText: '',
      taskType: '',
      gradeLevel: '5',
      language: 'English',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runGenerateStudyMaterials(data);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate materials. Please try again.",
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
              <FormLabel>Source Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Paste text from a lesson, article, or your notes here..." {...field} rows={8} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of material to generate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          {isLoading ? 'Generating...' : 'Generate Materials'}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result ? (
    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
        {result.generatedContent}
    </div>
  ) : null;

  return (
    <ToolView
      title="Worksheet Wizard"
      description="Your versatile study aid generator. Create worksheets, mock papers, and more from any text."
      form={formComponent}
      result={resultComponent}
      isLoading={isLoading}
      onBack={onBack}
    />
  );
}
