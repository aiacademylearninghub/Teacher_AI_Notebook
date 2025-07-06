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


// Schemas for structured output
const DifferentiatedWorksheetSchema = z.object({
  type: z.literal('worksheet'),
  comprehensionQuestions: z.array(z.string()).describe("A list of reading comprehension questions."),
  vocabularyTasks: z.array(z.string()).describe("A list of tasks focused on vocabulary from the text."),
  creativeTasks: z.array(z.string()).describe("A list of creative tasks or writing prompts related to the text."),
});

const MockQuestionPaperSchema = z.object({
    type: z.literal('mock-paper'),
    title: z.string().describe("The title of the mock question paper."),
    totalMarks: z.number().describe("The total marks for the paper."),
    sections: z.array(z.object({
        title: z.string().describe("The title of the section (e.g., 'Multiple Choice', 'Short Answer')."),
        questions: z.array(z.string()).describe("A list of questions for this section."),
    })).describe("The sections of the question paper."),
});

const InterviewPrepSchema = z.object({
    type: z.literal('interview-prep'),
    title: z.string().describe("The title for the interview preparation guide."),
    introduction: z.string().describe("A brief introduction to the interview prep guide."),
    sections: z.array(z.object({
        title: z.string().describe("The title of the section (e.g., 'General Questions', 'Technical Questions')."),
        questions: z.array(z.object({
            question: z.string().describe("The interview question."),
            talkingPoints: z.array(z.string()).describe("A list of key talking points or sample answers."),
        })).describe("A list of questions for this section."),
    })).describe("The main sections of the guide."),
});

const KeyConceptsSummarySchema = z.object({
    type: z.literal('summary'),
    title: z.string().describe("The title of the summary."),
    concepts: z.array(z.object({
        concept: z.string().describe("The key concept or term."),
        summary: z.string().describe("The summary or definition of the concept."),
    })).describe("A list of key concepts and their summaries."),
});


const GenerateStudyMaterialsOutputSchema = z.object({
  generatedContent: z.union([
      DifferentiatedWorksheetSchema,
      MockQuestionPaperSchema,
      InterviewPrepSchema,
      KeyConceptsSummarySchema
  ]).describe("The generated study material in a structured format based on the task type."),
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
Generate a structured JSON output that conforms to the provided schema. The 'type' field in the output must correspond to the requested 'Task Type'.

Task to perform: {{{taskType}}}

The material should be tailored for:
- Grade Level: {{{gradeLevel}}}
- Language: {{{language}}}

Source Text:
{{{lessonText}}}

---

Instructions for JSON output based on Task Type:
- If the task is 'Differentiated Worksheet', populate the 'DifferentiatedWorksheet' schema. Create three sections: Comprehension Questions, Vocabulary Tasks, and Creative Tasks.
- If the task is 'Mock Question Paper', populate the 'MockQuestionPaper' schema. Create a question paper with a mix of multiple-choice, short-answer, and long-answer questions. Include a title and suggest total marks.
- If the task is 'Interview Preparation', populate the 'InterviewPrep' schema. Generate a list of potential interview questions based on the text, along with key talking points or sample answers for each.
- If the task is 'Key Concepts Summary', populate the 'KeyConceptsSummary' schema. Extract and summarize the most important concepts, definitions, and key takeaways from the text. Use bullet points and bold text for clarity.

Adhere strictly to the output schema.`,
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
