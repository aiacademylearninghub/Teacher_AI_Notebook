"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { lessonPlannerSchema } from '@/lib/schemas';
import { runGenerateLessonPlan } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type FormData = z.infer<typeof lessonPlannerSchema>;

type LessonPlan = {
  day: number;
  objective: string;
  activity: string;
  materials: string[];
  exit_question: string;
};

export function LessonPlannerTool({ onBack }: { onBack: () => void }) {
  const [result, setResult] = useState<{ lesson_plan: LessonPlan[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(lessonPlannerSchema),
    defaultValues: {
      topic: '',
      gradeLevel: '5',
      language: 'English',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await runGenerateLessonPlan(data);
      setResult(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
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
                <Input placeholder="e.g., Photosynthesis" {...field} />
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
                <Input placeholder="e.g., English, Bengali" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result ? (
    <Accordion type="single" collapsible className="w-full">
      {result.lesson_plan.map((dayPlan) => (
        <AccordionItem value={`day-${dayPlan.day}`} key={dayPlan.day}>
          <AccordionTrigger className="font-headline text-lg">Day {dayPlan.day}</AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
              <p><strong>Objective:</strong> {dayPlan.objective}</p>
              <p><strong>Activity:</strong> {dayPlan.activity}</p>
              <p><strong>Materials:</strong> {dayPlan.materials.join(', ')}</p>
              <p><strong>Exit Question:</strong> {dayPlan.exit_question}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ) : null;

  return (
    <ToolView
      title="Lesson Planner"
      description="Generate 5-day lesson plans for any topic."
      onBack={onBack}
      form={formComponent}
      result={resultComponent}
      isLoading={isLoading}
    />
  );
}
