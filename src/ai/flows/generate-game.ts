// use server'

/**
 * @fileOverview This file defines a Genkit flow for generating paper/board-based games to teach specific concepts to students within a 15-minute timeframe.
 *
 * - generateGame - A function that handles the game generation process.
 * - GenerateGameInput - The input type for the generateGame function.
 * - GenerateGameOutput - The return type for the generateGame function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGameInputSchema = z.object({
  topic: z.string().describe('The topic the game should teach.'),
  gradeLevel: z.string().describe('The grade level of the students playing the game.'),
  language: z.string().describe('The language the game should be in.'),
});
export type GenerateGameInput = z.infer<typeof GenerateGameInputSchema>;

const GenerateGameOutputSchema = z.object({
  gameName: z.string().describe('The name of the generated game.'),
  gameInstructions: z
    .string()
    .describe('Detailed instructions on how to play the game.'),
  materialsNeeded: z
    .string()
    .describe('A list of materials needed to play the game.'),
  learningObjective: z
    .string()
    .describe('The learning objective of the game.'),
});
export type GenerateGameOutput = z.infer<typeof GenerateGameOutputSchema>;

export async function generateGame(input: GenerateGameInput): Promise<GenerateGameOutput> {
  return generateGameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGamePrompt',
  input: {schema: GenerateGameInputSchema},
  output: {schema: GenerateGameOutputSchema},
  prompt: `You are a creative game designer specializing in creating educational games for students.

You will generate a paper/board-based game tailored to teach the specified topic to students within a 15-minute timeframe.

Consider the grade level and language when designing the game.

Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Language: {{{language}}}

Ensure the game is engaging, easy to understand, and effectively teaches the specified concept.

Output should include the game name, detailed instructions, a list of materials needed, and the learning objective.

Follow this format:
Game Name: [Game Name]
Game Instructions: [Detailed instructions on how to play the game]
Materials Needed: [A list of materials needed to play the game]
Learning Objective: [The learning objective of the game]
`,
});

const generateGameFlow = ai.defineFlow(
  {
    name: 'generateGameFlow',
    inputSchema: GenerateGameInputSchema,
    outputSchema: GenerateGameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
