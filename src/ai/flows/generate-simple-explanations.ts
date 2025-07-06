'use server';

/**
 * @fileOverview Generates simple explanations of questions using real-life analogies.
 *
 * - generateSimpleExplanation - A function that generates a simple explanation.
 * - GenerateSimpleExplanationInput - The input type for the generateSimpleExplanation function.
 * - GenerateSimpleExplanationOutput - The return type for the generateSimpleExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSimpleExplanationInputSchema = z.object({
  question: z.string().describe('The question to be explained.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  language: z.string().describe('The language of the explanation.'),
});
export type GenerateSimpleExplanationInput = z.infer<
  typeof GenerateSimpleExplanationInputSchema
>;

const GenerateSimpleExplanationOutputSchema = z.object({
  explanation: z.string().describe('The simple explanation of the question.'),
  analogySuggestion: z
    .string()
    .describe('A suggestion for a real-life analogy (farming, cooking).'),
  chalkboardDrawingSuggestion:
    z.string().describe('A suggestion for a chalkboard drawing.'),
});
export type GenerateSimpleExplanationOutput = z.infer<
  typeof GenerateSimpleExplanationOutputSchema
>;

export async function generateSimpleExplanation(
  input: GenerateSimpleExplanationInput
): Promise<GenerateSimpleExplanationOutput> {
  return generateSimpleExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSimpleExplanationPrompt',
  input: {schema: GenerateSimpleExplanationInputSchema},
  output: {schema: GenerateSimpleExplanationOutputSchema},
  prompt: `You are an AI tool that provides simple explanations of questions using real-life analogies (farming, cooking), suggesting a chalkboard drawing, designed for clarity for specific grades and languages.

  Question: {{{question}}}
  Grade Level: {{{gradeLevel}}}
  Language: {{{language}}}

  Provide a simple explanation, a real-life analogy suggestion (farming, cooking), and a chalkboard drawing suggestion.
  `,
});

const generateSimpleExplanationFlow = ai.defineFlow(
  {
    name: 'generateSimpleExplanationFlow',
    inputSchema: GenerateSimpleExplanationInputSchema,
    outputSchema: GenerateSimpleExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
