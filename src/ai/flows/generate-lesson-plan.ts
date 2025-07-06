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

const LessonPlanDaySchema = z.object({
    day: z.number().describe('The day of the lesson plan (1-5).'),
    objective: z.string().describe("The day's learning objective."),
    activity: z.string().describe("The day's main activity."),
    materials: z.array(z.string()).describe('A list of materials needed for the activity.'),
    exit_question: z.string().describe('An exit question to assess understanding.'),
});

const GenerateLessonPlanOutputSchema = z.object({
  lesson_plan: z.array(LessonPlanDaySchema).describe('A 5-day lesson plan including objectives, activities, material lists, and exit questions.'),
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

The lesson plan should include daily objectives, activities, a list of required materials, and suggested exit questions to assess student understanding.`,
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
