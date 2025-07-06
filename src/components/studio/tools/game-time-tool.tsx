"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ToolView } from '../tool-view';
import { useToast } from '@/hooks/use-toast';
import { runPlayTicTacToe } from '@/lib/actions';
import { Loader2, RotateCw, X, Circle, Trophy, Dices, ArrowLeft, Puzzle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- Tic Tac Toe Game Component ---
type Player = 'X' | 'O';
type SquareValue = Player | '';
type BoardState = SquareValue[];
type Winner = SquareValue | 'draw';

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

const TicTacToeGame = () => {
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
      setBoard(board);
    } finally {
      setIsAiTurn(false);
    }
  };

  const GameStatus = () => {
    if (!winner) {
      return (
        <div className="text-center text-muted-foreground h-20 flex items-center justify-center">
            {isAiTurn ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <p>Your turn (X)</p>}
        </div>
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
      <Alert variant={alertVariant ?? undefined} className="my-4 animate-fade-in h-20 flex flex-col justify-center">
        <Trophy className="h-4 w-4"/>
        <AlertTitle>{alertTitle}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
        <h3 className="text-lg font-semibold">Play Tic-Tac-Toe vs AI</h3>
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
      <GameStatus />
      <Button onClick={handleReset} variant="outline" size="sm">
          <RotateCw className="mr-2 h-4 w-4" />
          New Game
      </Button>
    </div>
  );
};


// --- Dice Roller Game Component ---
const DieFace = ({ value }: { value: number }) => {
    const patterns: { [key: number]: number[][] } = {
        1: [[1, 1]],
        2: [[0, 0], [2, 2]],
        3: [[0, 0], [1, 1], [2, 2]],
        4: [[0, 0], [0, 2], [2, 0], [2, 2]],
        5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
        6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
    };
    const dots = patterns[value] || [];

    return (
        <div className="w-24 h-24 bg-card rounded-lg shadow-md p-2 border border-border">
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-1">
                {Array.from({ length: 9 }).map((_, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const isDotVisible = dots.some(dot => dot[0] === row && dot[1] === col);

                    return (
                        <div key={index} className="flex items-center justify-center">
                            {isDotVisible && <div className="w-5 h-5 bg-primary rounded-full" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const DiceRollerGame = () => {
    const [dieValue, setDieValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        setIsRolling(true);
        let rollCount = 0;
        const interval = setInterval(() => {
            setDieValue(Math.floor(Math.random() * 6) + 1);
            rollCount++;
            if (rollCount > 10) {
                clearInterval(interval);
                setIsRolling(false);
                setDieValue(Math.floor(Math.random() * 6) + 1);
            }
        }, 100);
    };
    
    useEffect(() => {
        setDieValue(Math.floor(Math.random() * 6) + 1);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-4 h-full">
            <h2 className="text-xl font-semibold">Dice Roller</h2>
            <DieFace value={dieValue} />
            <Button onClick={rollDice} disabled={isRolling}>
                <Dices className="mr-2 h-5 w-5" />
                {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>
        </div>
    );
};


// --- Game Menu Component ---
const GameMenu = ({ onSelectGame }: { onSelectGame: (game: Game) => void }) => {
    const games = [
        { id: 'tic-tac-toe', title: 'Tic-Tac-Toe', description: 'Play a classic game against the AI.', icon: Puzzle },
        { id: 'dice-roller', title: 'Dice Roller', description: 'A simple, interactive die for board games.', icon: Dices }
    ];

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {games.map(game => (
                <Card key={game.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onSelectGame(game.id as Game)}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <game.icon className="w-6 h-6 text-primary" />
                            {game.title}
                        </CardTitle>
                        <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}

// --- Main GameTimeTool Component ---
type Game = 'tic-tac-toe' | 'dice-roller';

interface GameTimeToolProps {
  onBack: () => void;
}

export function GameTimeTool({ onBack }: GameTimeToolProps) {
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  const renderContent = () => {
    switch(activeGame) {
        case 'tic-tac-toe':
            return <TicTacToeGame />;
        case 'dice-roller':
            return <DiceRollerGame />;
        case null:
        default:
            return <GameMenu onSelectGame={setActiveGame} />;
    }
  }

  const formComponent = (
    <div>
        <p className="text-sm text-muted-foreground">
            Select a game to play. More games will be added soon!
        </p>
    </div>
  );

  const resultComponent = (
    <div className="h-full">
        {activeGame && (
            <Button variant="ghost" onClick={() => setActiveGame(null)} className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Games
            </Button>
        )}
        <div className="flex flex-col items-center justify-center h-full">
            {renderContent()}
        </div>
    </div>
  );


  return (
    <ToolView
      title="Game Time"
      description="Play simple, fun, and interactive games directly in your browser."
      form={formComponent}
      result={resultComponent}
      isLoading={false}
      onBack={onBack}
    />
  );
}
