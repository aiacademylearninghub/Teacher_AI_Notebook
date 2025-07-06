'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating engaging, cognitively-challenging paper/board-based games for students. The games are designed to be adaptable for different skill levels.
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
  gameName: z.string().describe('A creative and catchy name for the generated game.'),
  gameInstructions: z
    .string()
    .describe('Detailed, step-by-step instructions on how to play the game, written clearly for a teacher to understand.'),
  materialsNeeded: z
    .string()
    .describe('A simple list of common classroom or household materials needed to play the game.'),
  learningObjective: z
    .string()
    .describe('The specific educational or cognitive skill the game aims to develop.'),
  gameAdaptations: z.string().describe('Suggestions on how to make the game simpler for younger players or more challenging for advanced players.')
});
export type GenerateGameOutput = z.infer<typeof GenerateGameOutputSchema>;

export async function generateGame(input: GenerateGameInput): Promise<GenerateGameOutput> {
  return generateGameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGamePrompt',
  input: {schema: GenerateGameInputSchema},
  output: {schema: GenerateGameOutputSchema},
  prompt: `You are an expert curriculum designer specializing in creating educational games that foster critical thinking and cognitive development in children.

Your task is to design a paper-based or simple board game for students. The game must be playable within approximately 15 minutes. It should be engaging, interactive, and strategically designed to develop the child's brain.

Focus on creating mechanics that encourage:
- Problem-solving
- Strategic thinking
- Creativity
- Memory and recall

The game must be tailored to the specified topic, grade level, and language.

Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Language: {{{language}}}

Crucially, you must also provide suggestions for how a teacher can adapt the game to be either simpler for students who are struggling, or more complex for students who need a challenge.

Please provide a creative game name, clear instructions, a list of simple materials, the core learning objective, and ideas for adaptation.
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
