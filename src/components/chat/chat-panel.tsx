"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Send } from 'lucide-react';
import type { Source } from '@/components/sources/source-panel';

interface ChatPanelProps {
  sources: Source[];
  onAddSource: () => void;
}

export function ChatPanel({ sources, onAddSource }: ChatPanelProps) {
  const hasSources = sources.length > 0;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
        {!hasSources ? (
          <>
            <div className="p-4 bg-muted rounded-full">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Add a source to get started</h2>
            <Button variant="outline" className="bg-card hover:bg-muted" onClick={onAddSource}>Upload a source</Button>
          </>
        ) : (
          <div className="text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground mb-2">Ready to Chat</h2>
            <p>Ask questions, get summaries, or brainstorm ideas based on your sources.</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <div className="relative">
          <Textarea 
            placeholder={hasSources ? "Ask a question about your sources..." : "Upload a source to get started"}
            className="bg-card border-none pr-12 text-base"
            rows={1}
            disabled={!hasSources}
          />
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={!hasSources}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
            NotebookLM can be inaccurate, please double check its responses.
        </p>
      </div>
    </div>
  );
}
