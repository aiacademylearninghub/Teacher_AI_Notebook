'use server';
/**
 * @fileOverview This file defines a Genkit flow for playing a game of Tic-Tac-Toe against an AI.
 *
 * - playTicTacToe - A function that takes the current board state and returns the AI's move.
 * - PlayTicTacToeInput - The input type for the playTicTacToe function.
 * - PlayTicTacToeOutput - The return type for the playTicTacToe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlayTicTacToeInputSchema = z.object({
  board: z.array(z.string()).length(9).describe("The 9-cell Tic-Tac-Toe board. Use '' for empty, 'X' for player, 'O' for AI."),
});
export type PlayTicTacToeInput = z.infer<typeof PlayTicTacToeInputSchema>;

const PlayTicTacToeOutputSchema = z.object({
  board: z.array(z.string()).length(9).describe("The updated 9-cell Tic-Tac-Toe board after the AI's move."),
});
export type PlayTicTacToeOutput = z.infer<typeof PlayTicTacToeOutputSchema>;

export async function playTicTacToe(input: PlayTicTacToeInput): Promise<PlayTicTacToeOutput> {
  return playTicTacToeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'playTicTacToePrompt',
  input: {schema: PlayTicTacToeInputSchema},
  output: {schema: PlayTicTacToeOutputSchema},
  prompt: `You are an expert Tic-Tac-Toe player. Your symbol is 'O'. The user's symbol is 'X'.
The board is represented as a 9-element array, where the index corresponds to the board position from top-left (0) to bottom-right (8).

Current board state:
{{json board}}

It is your turn to move. Analyze the board and make the optimal move to win the game.
If you cannot win, make a move to block the user from winning.
If neither is possible, take any available strategic position.

Place your 'O' in one of the empty cells. Do not change any existing 'X's or 'O's.
Return the entire updated board state as a JSON array in the 'board' field.`,
});

const playTicTacToeFlow = ai.defineFlow(
  {
    name: 'playTicTacToeFlow',
    inputSchema: PlayTicTacToeInputSchema,
    outputSchema: PlayTicTacToeOutputSchema,
  },
  async ({ board }) => {
    // Basic validation: If it's not O's turn, or game is over, don't call the AI.
    const xCount = board.filter(c => c === 'X').length;
    const oCount = board.filter(c => c === 'O').length;
    if (xCount <= oCount) {
      // It's not O's turn (or X hasn't moved yet), just return the board.
      // This is a safeguard, the client should prevent this call.
      return { board };
    }

    const {output} = await prompt({ board });
    return output!;
  }
);
