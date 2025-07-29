'use server';
/**
 * @fileOverview A RAG agent that answers questions based on provided sources.
 *
 * - chatWithSources - A function that handles the chat process.
 * - ChatWithSourcesInput - The input type for the chatWithSources function.
 * - ChatWithSourcesOutput - The return type for the chatWithSources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SourceSchema = z.object({
  name: z.string().describe('The name or title of the source document.'),
  content: z.string().describe('The full text content of the source.'),
});

const ChatWithSourcesInputSchema = z.object({
  question: z.string().describe("The user's question."),
  sources: z.array(SourceSchema).describe('A list of sources to use for answering the question.'),
});
export type ChatWithSourcesInput = z.infer<typeof ChatWithSourcesInputSchema>;

const ChatWithSourcesOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, based only on the provided sources.'),
});
export type ChatWithSourcesOutput = z.infer<typeof ChatWithSourcesOutputSchema>;

export async function chatWithSources(input: ChatWithSourcesInput): Promise<ChatWithSourcesOutput> {
  return chatWithSourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithSourcesPrompt',
  input: {schema: ChatWithSourcesInputSchema},
  output: {schema: ChatWithSourcesOutputSchema},
  prompt: `You are a helpful AI assistant specialized in analyzing documents. Your task is to answer the user's question based *only* on the information provided in the sources below.

- Do not use any external knowledge or information you might have.
- If the answer cannot be found within the provided sources, you must respond with "I could not find an answer in the provided sources."
- Be concise and directly answer the question.

Here are the sources:
{{#each sources}}
---
Source Name: {{{name}}}
Source Content:
{{{content}}}
---
{{/each}}

User's Question: {{{question}}}

Answer:`,
});

const chatWithSourcesFlow = ai.defineFlow(
  {
    name: 'chatWithSourcesFlow',
    inputSchema: ChatWithSourcesInputSchema,
    outputSchema: ChatWithSourcesOutputSchema,
  },
  async input => {
    if (!input.sources || input.sources.length === 0) {
        return { answer: "Please add a source document before asking a question." };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
