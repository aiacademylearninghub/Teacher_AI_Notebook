"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Send } from 'lucide-react';

export function ChatPanel() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="p-4 bg-muted rounded-full">
            <UploadCloud className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Add a source to get started</h2>
        <Button variant="outline" className="bg-card hover:bg-muted">Upload a source</Button>
      </div>
      <div className="p-4 border-t border-border">
        <div className="relative">
          <Textarea 
            placeholder="Upload a source to get started" 
            className="bg-card border-none pr-12 text-base"
            rows={1}
          />
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
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
