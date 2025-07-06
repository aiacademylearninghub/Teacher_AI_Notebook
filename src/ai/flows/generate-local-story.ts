'use server';

/**
 * @fileOverview Generates contextually relevant stories for Indian students.
 *
 * - generateLocalStory - A function that generates a story based on grade, language, and topic.
 * - GenerateLocalStoryInput - The input type for the generateLocalStory function.
 * - GenerateLocalStoryOutput - The return type for the generateLocalStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocalStoryInputSchema = z.object({
  grade: z.number().describe('The grade level of the students.'),
  language: z.string().describe('The language of the story.'),
  topic: z.string().describe('The topic of the story.'),
});
export type GenerateLocalStoryInput = z.infer<typeof GenerateLocalStoryInputSchema>;

const GenerateLocalStoryOutputSchema = z.object({
  story: z.string().describe('The generated story.'),
});
export type GenerateLocalStoryOutput = z.infer<typeof GenerateLocalStoryOutputSchema>;

export async function generateLocalStory(input: GenerateLocalStoryInput): Promise<GenerateLocalStoryOutput> {
  return generateLocalStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocalStoryPrompt',
  input: {schema: GenerateLocalStoryInputSchema},
  output: {schema: GenerateLocalStoryOutputSchema},
  prompt: `You are a story writer who specializes in writing stories for Indian students.

The stories should be contextually relevant to the students, using farmer analogies and local festival references.

The story should be appropriate for the specified grade level and language.

Grade: {{{grade}}}
Language: {{{language}}}
Topic: {{{topic}}}

Story:`,
});

const generateLocalStoryFlow = ai.defineFlow(
  {
    name: 'generateLocalStoryFlow',
    inputSchema: GenerateLocalStoryInputSchema,
    outputSchema: GenerateLocalStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
