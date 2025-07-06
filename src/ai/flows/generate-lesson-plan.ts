'use server';

/**
 * @fileOverview Generates a 5-day lesson plan including objectives, activities, material lists and exit questions.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  topic: z.string().describe('The topic of the lesson plan.'),
  gradeLevel: z.string().describe('The grade level for the lesson plan.'),
  language: z.string().describe('The language of instruction.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('A 5-day lesson plan including objectives, activities, material lists, and exit questions.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an experienced teacher creating a 5-day lesson plan for the topic: {{{topic}}}. The lesson plan should be appropriate for grade level: {{{gradeLevel}}}, and the language of instruction is: {{{language}}}.

The lesson plan should include daily objectives, activities, a list of required materials, and suggested exit questions to assess student understanding. The output MUST be valid JSON. Here is the JSON schema for the response: 

${JSON.stringify(GenerateLessonPlanOutputSchema.shape, null, 2)}`,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
