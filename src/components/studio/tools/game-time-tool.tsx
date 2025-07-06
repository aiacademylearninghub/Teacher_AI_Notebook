"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import { runPlayTicTacToe } from '@/lib/actions';
import { Loader2, RotateCw, X, Circle, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Player = 'X' | 'O';
type SquareValue = Player | '';
type BoardState = SquareValue[];
type Winner = SquareValue | 'draw';

interface GameTimeToolProps {
  onBack: () => void;
}

const calculateWinner = (squares: BoardState): Winner | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every(square => square !== '')) {
    return 'draw';
  }
  return null;
};

const Square = ({ value, onClick, disabled }: { value: SquareValue, onClick: () => void, disabled: boolean }) => (
  <button
    className="w-20 h-20 md:w-24 md:h-24 bg-card border border-border flex items-center justify-center rounded-lg transition-colors hover:bg-muted disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={disabled}
  >
    {value === 'X' && <X className="w-12 h-12 text-primary" />}
    {value === 'O' && <Circle className="w-12 h-12 text-secondary-foreground" />}
  </button>
);

export function GameTimeTool({ onBack }: GameTimeToolProps) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(''));
  const [isAiTurn, setIsAiTurn] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);
  const { toast } = useToast();

  const handleReset = () => {
    setBoard(Array(9).fill(''));
    setIsAiTurn(false);
    setWinner(null);
  };
  
  useEffect(() => {
    const currentWinner = calculateWinner(board);
    if (currentWinner) {
      setWinner(currentWinner);
    }
  }, [board]);
  
  const handlePlayerMove = async (index: number) => {
    if (board[index] || winner || isAiTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const newWinner = calculateWinner(newBoard);
    if(newWinner) {
      setWinner(newWinner);
      return;
    }

    setIsAiTurn(true);

    try {
      const response = await runPlayTicTacToe({ board: newBoard });
      setBoard(response.board);
    } catch (error) {
      toast({
        title: "AI Error",
        description: "The AI failed to make a move. Please try again.",
        variant: "destructive",
      });
      // Revert board if AI fails
      setBoard(board);
    } finally {
      setIsAiTurn(false);
    }
  };

  const GameStatus = () => {
    if (!winner) {
      return (
        <p className="text-center text-muted-foreground">
          {isAiTurn ? "AI is thinking..." : "Your turn (X)"}
        </p>
      );
    }

    let message, alertVariant: "default" | "destructive" | null = "default";
    let alertTitle;

    if (winner === 'X') {
      alertTitle = "Congratulations!";
      message = "You won the game!";
    } else if (winner === 'O') {
      alertTitle = "Game Over";
      message = "The AI has won. Better luck next time!";
      alertVariant = "destructive";
    } else {
      alertTitle = "It's a Draw!";
      message = "A well-fought game from both sides!";
    }

    return (
      <Alert variant={alertVariant ?? undefined} className="mt-4 animate-fade-in">
        <Trophy className="h-4 w-4"/>
        <AlertTitle>{alertTitle}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  };
  
  const formComponent = (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-semibold">How to Play</h3>
      <p className="text-sm text-muted-foreground">
        Welcome to AI Tic-Tac-Toe! You are 'X' and the AI is 'O'. Click on an empty square to make your move. The first to get three in a row wins.
      </p>
      <Button onClick={handleReset}>
        <RotateCw className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </div>
  );

  const resultComponent = (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <Card className="p-2 md:p-4 bg-background">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 gap-2">
            {board.map((value, i) => (
              <Square
                key={i}
                value={value}
                onClick={() => handlePlayerMove(i)}
                disabled={isAiTurn || !!winner || value !== ''}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {isAiTurn && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
      
      <GameStatus />
    </div>
  );

  return (
    <ToolView
      title="Game Time: Tic-Tac-Toe"
      description="Play a game of Tic-Tac-Toe against our AI."
      form={formComponent}
      result={resultComponent}
      isLoading={false} // Loading is handled internally
      onBack={onBack}
    />
  );
}
