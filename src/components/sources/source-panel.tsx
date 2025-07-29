"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Plus, FolderArchive, PanelLeftClose } from "lucide-react"
import { SourceCard } from "./source-card"
import type { LucideIcon } from 'lucide-react';

export interface Source {
  id: string;
  name: string;
  icon: LucideIcon;
  content: string;
  type: string;
  isSelected: boolean;
}

interface SourcePanelProps {
    sources: Source[];
    onAddSource: () => void;
    onToggleSource: (id: string) => void;
    onClose?: () => void;
}

export function SourcePanel({ sources, onAddSource, onToggleSource, onClose }: SourcePanelProps) {
  return (
    <div className="flex flex-col h-full p-4 gap-4 bg-card/40 border-l border-border animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sources</h2>
        {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} title="Collapse source panel">
                <PanelLeftClose className="w-5 h-5" />
            </Button>
        )}
      </div>
      <Button variant="outline" className="w-full bg-background hover:bg-muted justify-center" onClick={onAddSource}>
          <Plus className="mr-2 h-4 w-4" />
          Add Source
      </Button>

      {sources.length > 0 ? (
         <div className="flex-1 overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-2 px-1">Select sources to include in conversation:</p>
            <div className="flex flex-col gap-1">
              {sources.map((source) => (
                <SourceCard 
                    key={source.id} 
                    source={source}
                    onToggleSource={onToggleSource} 
                />
              ))}
            </div>
         </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground p-4">
            <FolderArchive className="w-12 h-12" />
            <p className="font-semibold">Your sources will appear here</p>
            <p className="text-sm">
             Add sources to start a conversation with your documents.
            </p>
        </div>
      )}
    </div>
  )
}
