"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Plus, Search, FolderArchive } from "lucide-react"
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
}

export function SourcePanel({ sources, onAddSource, onToggleSource }: SourcePanelProps) {
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sources</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full bg-card hover:bg-muted justify-start" onClick={onAddSource}>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
        <Button variant="outline" className="w-full bg-card hover:bg-muted justify-start">
          <Search className="mr-2 h-4 w-4" />
          Discover
        </Button>
      </div>

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
            <p className="font-semibold">Saved sources will appear here</p>
            <p className="text-sm">
            Click Add source above to add PDFs, websites, text, videos, or audio files. Or import a file directly from Google Drive.
            </p>
        </div>
      )}
    </div>
  )
}
