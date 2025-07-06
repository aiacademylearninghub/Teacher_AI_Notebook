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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ListChecks, PencilRuler, GraduationCap, Briefcase, FileText } from 'lucide-react';

type FormData = z.infer<typeof worksheetWizardSchema>;
type ResultType = GenerateStudyMaterialsOutput['generatedContent'] | null;

const taskTypes = [
    { value: "Differentiated Worksheet", label: "Differentiated Worksheet", icon: PencilRuler },
    { value: "Mock Question Paper", label: "Mock Question Paper", icon: GraduationCap },
    { value: "Interview Preparation", label: "Interview Preparation", icon: Briefcase },
    { value: "Key Concepts Summary", label: "Key Concepts Summary", icon: FileText },
];

const RenderInterviewPrep = ({ data }: { data: Extract<ResultType, { type: 'interview-prep' }> }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold font-headline">{data.title}</h2>
        <p className="text-muted-foreground">{data.introduction}</p>
        <Accordion type="single" collapsible className="w-full" defaultValue={data.sections[0]?.title}>
            {data.sections.map((section) => (
                <AccordionItem value={section.title} key={section.title}>
                    <AccordionTrigger className="text-lg">{section.title}</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        {section.questions.map((q, index) => (
                            <Card key={index} className="bg-background/50">
                                <CardHeader>
                                    <CardTitle className="text-base">{q.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-semibold mb-2 text-muted-foreground">Key Talking Points:</p>
                                    <ul className="space-y-2 list-disc pl-5">
                                        {q.talkingPoints.map((point, pIndex) => (
                                            <li key={pIndex} className="text-sm">{point}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
);

const RenderWorksheet = ({ data }: { data: Extract<ResultType, { type: 'worksheet' }> }) => (
    <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="text-primary"/>Comprehension Questions</CardTitle></CardHeader>
            <CardContent>
                <ol className="list-decimal space-y-2 pl-5">
                    {data.comprehensionQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="text-primary"/>Vocabulary Tasks</CardTitle></CardHeader>
            <CardContent>
                <ol className="list-decimal space-y-2 pl-5">
                    {data.vocabularyTasks.map((task, i) => <li key={i}>{task}</li>)}
                </ol>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><PencilRuler className="text-primary"/>Creative Tasks</CardTitle></CardHeader>
            <CardContent>
                <ol className="list-decimal space-y-2 pl-5">
                    {data.creativeTasks.map((task, i) => <li key={i}>{task}</li>)}
                </ol>
            </CardContent>
        </Card>
    </div>
);

const RenderMockPaper = ({ data }: { data: Extract<ResultType, { type: 'mock-paper' }> }) => (
    <div>
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-headline">{data.title}</h2>
            <Badge variant="secondary" className="mt-2">Total Marks: {data.totalMarks}</Badge>
        </div>
        <div className="space-y-6">
            {data.sections.map((section, i) => (
                <Card key={i}>
                    <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
                    <CardContent>
                        <ol className="list-decimal space-y-3 pl-5">
                            {section.questions.map((q, j) => <li key={j}>{q}</li>)}
                        </ol>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

const RenderSummary = ({ data }: { data: Extract<ResultType, { type: 'summary' }> }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold font-headline">{data.title}</h2>
        {data.concepts.map((c, i) => (
            <Card key={i}>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="text-primary w-5 h-5"/> {c.concept}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{c.summary}</p>
                </CardContent>
            </Card>
        ))}
    </div>
);


const GeneratedContentRenderer = ({ result }: { result: ResultType }) => {
    if (!result) return null;

    switch (result.type) {
        case 'interview-prep':
            return <RenderInterviewPrep data={result} />;
        case 'worksheet':
            return <RenderWorksheet data={result} />;
        case 'mock-paper':
            return <RenderMockPaper data={result} />;
        case 'summary':
            return <RenderSummary data={result} />;
        default:
            return <p>The generated content could not be displayed.</p>;
    }
};

interface WorksheetWizardToolProps {
  onBack: () => void;
}

export function WorksheetWizardTool({ onBack }: WorksheetWizardToolProps) {
  const [result, setResult] = useState<ResultType>(null);
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
      setResult(response.generatedContent);
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
                    <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                           <type.icon className="h-4 w-4 text-muted-foreground" />
                           {type.label}
                        </div>
                    </SelectItem>
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

  const resultComponent = <GeneratedContentRenderer result={result} />;

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
