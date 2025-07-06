'use server';
/**
 * @fileOverview AI agent that generates various study materials like worksheets, mock papers, interview prep, and summaries from input text.
 *
 * - generateStudyMaterials - A function that handles the study material generation process.
 * - GenerateStudyMaterialsInput - The input type for the generateStudyMaterials function.
 * - GenerateStudyMaterialsOutput - The return type for the generateStudyMaterials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyMaterialsInputSchema = z.object({
  lessonText: z.string().describe('The input lesson text to generate materials from.'),
  taskType: z.string().describe('The type of material to generate (e.g., Differentiated Worksheet, Mock Question Paper).'),
  gradeLevel: z.string().describe('The grade level for which to generate the materials.'),
  language: z.string().describe('The language in which to generate the materials.'),
});
export type GenerateStudyMaterialsInput = z.infer<typeof GenerateStudyMaterialsInputSchema>;

const GenerateStudyMaterialsOutputSchema = z.object({
  generatedContent: z.string().describe('The generated content in well-structured Markdown format.'),
});
export type GenerateStudyMaterialsOutput = z.infer<typeof GenerateStudyMaterialsOutputSchema>;

export async function generateStudyMaterials(input: GenerateStudyMaterialsInput): Promise<GenerateStudyMaterialsOutput> {
  return generateStudyMaterialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyMaterialsPrompt',
  input: {schema: GenerateStudyMaterialsInputSchema},
  output: {schema: GenerateStudyMaterialsOutputSchema},
  prompt: `You are an expert educator and content creator. Your task is to generate educational materials based on the provided text and user requirements.

Task to perform: {{{taskType}}}

The material should be tailored for:
- Grade Level: {{{gradeLevel}}}
- Language: {{{language}}}

Source Text:
{{{lessonText}}}

---

Instructions based on Task Type:
- If the task is 'Differentiated Worksheet', create three sections: Comprehension Questions, Vocabulary Tasks, and Creative Tasks.
- If the task is 'Mock Question Paper', create a question paper with a mix of multiple-choice, short-answer, and long-answer questions. Include a title and suggest total marks.
- If the task is 'Interview Preparation', generate a list of potential interview questions based on the text, along with key talking points or sample answers for each.
- If the task is 'Key Concepts Summary', extract and summarize the most important concepts, definitions, and key takeaways from the text. Use bullet points and bold text for clarity.

Please generate the content in well-structured Markdown format. Ensure the entire response is a single block of Markdown text.`,
});

const generateStudyMaterialsFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialsFlow',
    inputSchema: GenerateStudyMaterialsInputSchema,
    outputSchema: GenerateStudyMaterialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
