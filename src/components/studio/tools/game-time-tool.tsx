"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { gameTimeSchema } from '@/lib/schemas';
import { runGenerateGame } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import type { GenerateGameOutput } from '@/ai/flows/generate-game';
import { Separator } from '@/components/ui/separator';

type FormData = z.infer<typeof gameTimeSchema>;

export function GameTimeTool({ onBack }: { onBack: () => void }) {
  const [result, setResult] = useState<GenerateGameOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(gameTimeSchema),
    defaultValues: {
      topic: '',
      gradeLevel: '3',
      language: 'English',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runGenerateGame(data);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate game. Please try again.",
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
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Addition and Subtraction" {...field} />
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
                <Input placeholder="e.g., English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Game'}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result ? (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
        <h2 className="font-headline text-xl font-bold mt-0">{result.gameName}</h2>
        <Separator/>
        <p><strong>Learning Objective:</strong> {result.learningObjective}</p>
        <p><strong>Materials Needed:</strong> {result.materialsNeeded}</p>
        <h3>Instructions</h3>
        <p className="whitespace-pre-wrap">{result.gameInstructions}</p>
    </div>
  ) : null;

  return (
    <ToolView
      title="Game Time"
      description="Create educational paper or board games in minutes."
      onBack={onBack}
      form={formComponent}
      result={resultComponent}
      isLoading={isLoading}
    />
  );
}
