"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { localStorySchema } from '@/lib/schemas';
import { runGenerateStory, runGenerateImage, runGenerateAudio } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon, Mic, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

type FormData = z.infer<typeof localStorySchema>;

interface LocalStoryToolProps {
  onBack: () => void;
}

export function LocalStoryTool({ onBack }: LocalStoryToolProps) {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<FormData | null>(null);
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(localStorySchema),
    defaultValues: {
      topic: '',
      grade: 5,
      language: 'English',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    setImageUrl(null);
    setAudioUrl(null);
    setLastSubmittedData(data);
    try {
      const response = await runGenerateStory(data);
      setResult(response.story);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!result || !lastSubmittedData) return;
    setIsGeneratingImage(true);
    setImageUrl(null);
    try {
        const imagePrompt = `A beautiful, whimsical, and child-friendly illustration in a vibrant, storybook style. The image should capture the essence of a story about "${lastSubmittedData.topic}". Do not include any text in the image.`;
        const response = await runGenerateImage({ prompt: imagePrompt });
        setImageUrl(response.imageUrl);
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate image. Please try again.",
            variant: "destructive",
        });
        console.error(error);
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!result) return;
    setIsGeneratingAudio(true);
    setAudioUrl(null);
    try {
        const response = await runGenerateAudio({ text: result });
        setAudioUrl(response.audioUrl);
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate audio. Please try again.",
            variant: "destructive",
        });
        console.error(error);
    } finally {
        setIsGeneratingAudio(false);
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
                <Input placeholder="e.g., A clever monkey and a foolish crocodile" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
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
                <Input placeholder="e.g., Hindi, Tamil, English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Story'}
        </Button>
      </form>
    </Form>
  );

  const resultComponent = result ? (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
        {result}
      </div>
      
      <Separator />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
            <Button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !result}
                variant="outline"
                className="bg-card hover:bg-muted"
            >
                {isGeneratingImage ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                    <><ImageIcon className="mr-2 h-4 w-4" /> Generate Image</>
                )}
            </Button>
            <Button
                onClick={handleGenerateAudio}
                disabled={isGeneratingAudio || !result}
                variant="outline"
                className="bg-card hover:bg-muted"
            >
                {isGeneratingAudio ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                    <><Mic className="mr-2 h-4 w-4" /> Create Audio</>
                )}
            </Button>
        </div>

        {isGeneratingImage && <Skeleton className="w-full aspect-video rounded-lg" />}
        {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-border bg-muted">
                <Image
                    src={imageUrl}
                    alt="Generated illustration for the story"
                    width={512}
                    height={288}
                    className="w-full object-contain"
                />
            </div>
        )}
        
        {isGeneratingAudio && (
             <div className="flex items-center gap-3 p-2">
                <Skeleton className="h-10 w-full" />
            </div>
        )}
        {audioUrl && (
            <audio controls src={audioUrl} className="w-full">
                Your browser does not support the audio element.
            </audio>
        )}
      </div>
    </div>
  ) : null;

  return (
    <ToolView
      title="Local Storytelling"
      description="Generate stories with local context and farmer analogies."
      form={formComponent}
      result={resultComponent}
      isLoading={isLoading}
      onBack={onBack}
    />
  );
}
