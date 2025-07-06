"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { gameTimeSchema } from '@/lib/schemas';
import { runGenerateGame, runGenerateImage } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import type { GenerateGameOutput } from '@/ai/flows/generate-game';
import { Separator } from '@/components/ui/separator';
import { List, Target, ScrollText, Scaling, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


type FormData = z.infer<typeof gameTimeSchema>;

interface GameTimeToolProps {
  onBack: () => void;
}

const sampleTopics = [
    "Planetary Orbits",
    "Creative Writing Prompts",
    "Basic Economics: Supply & Demand",
    "Introduction to Photosynthesis",
];

export function GameTimeTool({ onBack }: GameTimeToolProps) {
  const [result, setResult] = useState<GenerateGameOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameBoardImageUrl, setGameBoardImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
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
    setGameBoardImageUrl(null);
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
  
  const handleGenerateBoardImage = async () => {
    if (!result?.gameBoardImagePrompt) return;
    setIsGeneratingImage(true);
    setGameBoardImageUrl(null);
    try {
        const response = await runGenerateImage({ prompt: result.gameBoardImagePrompt });
        setGameBoardImageUrl(response.imageUrl);
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate game board image. Please try again.",
            variant: "destructive",
        });
        console.error(error);
    } finally {
        setIsGeneratingImage(false);
    }
  };


  const formComponent = (
    <>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Need inspiration? Try one of these topics:</p>
        <div className="flex flex-wrap gap-2">
          {sampleTopics.map((topic) => (
            <Button
              key={topic}
              variant="outline"
              size="sm"
              className="bg-card hover:bg-muted h-auto py-1.5"
              onClick={() => form.setValue('topic', topic, { shouldValidate: true })}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>
      <Separator />
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
                    {[...Array(12)].map((_, i) => <SelectItem key={i + 1} value={String(i + 1)}>Grade {i + 1}</SelectItem>)}
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
    </>
  );

  const resultComponent = result ? (
    <div className="space-y-6 text-sm">
        <div className="text-center">
            <h2 className="text-xl font-bold">{result.gameName}</h2>
        </div>
        <Separator/>

        <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary"/>
                Learning Objective
            </h3>
            <p className="pl-7 text-muted-foreground">{result.learningObjective}</p>
        </div>

         <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <List className="h-5 w-5 text-primary"/>
                Materials Needed
            </h3>
            <p className="pl-7 text-muted-foreground whitespace-pre-wrap">{result.materialsNeeded}</p>
        </div>
        
        <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-primary"/>
                How to Play
            </h3>
            <p className="pl-7 text-muted-foreground whitespace-pre-wrap">{result.gameInstructions}</p>
        </div>

        <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Scaling className="h-5 w-5 text-primary"/>
                Game Adaptations
            </h3>
            <p className="pl-7 text-muted-foreground whitespace-pre-wrap">{result.gameAdaptations}</p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary"/>
                Game Board
            </h3>
            <p className="text-sm text-muted-foreground">Click the button below to generate a visual game board you can print or use as a reference.</p>
            <Button onClick={handleGenerateBoardImage} disabled={isGeneratingImage || !result}>
                {isGeneratingImage ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Board...</>
                ) : (
                    <><ImageIcon className="mr-2 h-4 w-4" /> Generate Game Board</>
                )}
            </Button>

            {isGeneratingImage && <Skeleton className="w-full aspect-video rounded-lg" />}
            {gameBoardImageUrl && (
                <div className="rounded-lg overflow-hidden border border-border bg-muted">
                    <Image
                        src={gameBoardImageUrl}
                        alt="Generated game board"
                        width={512}
                        height={288}
                        className="w-full object-contain"
                    />
                </div>
            )}
        </div>
    </div>
  ) : null;

  return (
    <ToolView
      title="Game Time"
      description="Create educational paper or board games in minutes."
      form={formComponent}
      result={resultComponent}
      isLoading={isLoading}
      onBack={onBack}
    />
  );
}
