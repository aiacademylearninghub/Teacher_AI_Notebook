'use server';
/**
 * @fileOverview AI agent that generates differentiated worksheets for various grade levels from input lesson text, covering comprehension, vocabulary, and creative tasks.
 *
 * - generateDifferentiatedWorksheets - A function that handles the worksheet generation process.
 * - GenerateDifferentiatedWorksheetsInput - The input type for the generateDifferentiatedWorksheets function.
 * - GenerateDifferentiatedWorksheetsOutput - The return type for the generateDifferentiatedWorksheets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDifferentiatedWorksheetsInputSchema = z.object({
  lessonText: z.string().describe('The input lesson text to generate worksheets from.'),
  gradeLevel: z.string().describe('The grade level for which to generate the worksheets.'),
  language: z.string().describe('The language in which to generate the worksheets.'),
});
export type GenerateDifferentiatedWorksheetsInput = z.infer<typeof GenerateDifferentiatedWorksheetsInputSchema>;

const GenerateDifferentiatedWorksheetsOutputSchema = z.object({
  comprehensionQuestions: z.string().describe('Comprehension questions based on the lesson text.'),
  vocabularyTasks: z.string().describe('Vocabulary tasks related to the lesson text.'),
  creativeTasks: z.string().describe('Creative tasks inspired by the lesson text.'),
});
export type GenerateDifferentiatedWorksheetsOutput = z.infer<typeof GenerateDifferentiatedWorksheetsOutputSchema>;

export async function generateDifferentiatedWorksheets(input: GenerateDifferentiatedWorksheetsInput): Promise<GenerateDifferentiatedWorksheetsOutput> {
  return generateDifferentiatedWorksheetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDifferentiatedWorksheetsPrompt',
  input: {schema: GenerateDifferentiatedWorksheetsInputSchema},
  output: {schema: GenerateDifferentiatedWorksheetsOutputSchema},
  prompt: `You are an expert teacher specializing in creating differentiated worksheets for students.

You will use the lesson text to generate differentiated worksheets for the specified grade level and language, covering comprehension, vocabulary, and creative tasks.

Lesson Text: {{{lessonText}}}
Grade Level: {{{gradeLevel}}}
Language: {{{language}}}

Generate the worksheets in a format suitable for direct use in the classroom.

Comprehension Questions:
Vocabulary Tasks:
Creative Tasks:`,
});

const generateDifferentiatedWorksheetsFlow = ai.defineFlow(
  {
    name: 'generateDifferentiatedWorksheetsFlow',
    inputSchema: GenerateDifferentiatedWorksheetsInputSchema,
    outputSchema: GenerateDifferentiatedWorksheetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
