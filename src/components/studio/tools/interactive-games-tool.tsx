"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ToolView } from '../tool-view';
import { Dices } from 'lucide-react';

interface InteractiveGamesToolProps {
  onBack: () => void;
}

const DieFace = ({ value }: { value: number }) => {
    // Patterns for dots from 1 to 6
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
        <div className="w-24 h-24 bg-card rounded-lg shadow-md p-2">
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-1">
                {/* Create a 3x3 grid of placeholders */}
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


const DiceRoller = () => {
    const [dieValue, setDieValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        setIsRolling(true);
        let rollCount = 0;
        const interval = setInterval(() => {
            setDieValue(Math.floor(Math.random() * 6) + 1);
            rollCount++;
            if (rollCount > 10) { // Animate for a short duration
                clearInterval(interval);
                setIsRolling(false);
                // Set final value after animation
                setDieValue(Math.floor(Math.random() * 6) + 1);
            }
        }, 100);
    };
    
    // Set initial dice value on mount
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


export function InteractiveGamesTool({ onBack }: InteractiveGamesToolProps) {
  
  const activeGame = 'dice-roller';

  const renderGame = () => {
      switch (activeGame) {
          case 'dice-roller':
              return <DiceRoller />;
          default:
              return <div className="flex h-full items-center justify-center text-muted-foreground"><p>Select a game to play.</p></div>
      }
  }

  return (
    <ToolView
      title="Interactive Games"
      description="A collection of simple, fun games to play directly in your browser."
      form={<div className="text-sm text-muted-foreground">More games like Snake & Ladder are coming soon!</div>}
      result={renderGame()}
      isLoading={false}
      onBack={onBack}
    />
  );
}
