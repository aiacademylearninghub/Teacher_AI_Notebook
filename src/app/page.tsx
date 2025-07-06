"use client"

import { useState } from 'react';
import { ChatPanel } from '@/components/chat/chat-panel';
import { SourcePanel, type Source } from '@/components/sources/source-panel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UploadSourceDialog } from '@/components/sources/upload-source-dialog';

export default function Home() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleToggleSource = (id: string) => {
    setSources(prevSources =>
      prevSources.map(source =>
        source.id === id ? { ...source, isSelected: !source.isSelected } : source
      )
    );
  };
  
  const selectedSources = sources.filter(source => source.isSelected);

  return (
    <>
      <div className="flex h-full">
        <aside className="hidden md:flex flex-col w-[320px] lg:w-[360px] border-r border-border">
          <SourcePanel 
            sources={sources} 
            onAddSource={() => setIsUploadDialogOpen(true)}
            onToggleSource={handleToggleSource}
          />
        </aside>
        <main className="flex-1 flex flex-col">
          <ChatPanel sources={selectedSources} onAddSource={() => setIsUploadDialogOpen(true)} />
        </main>
      </div>
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add a source</DialogTitle>
              </DialogHeader>
              <UploadSourceDialog 
                setSources={setSources} 
                closeDialog={() => setIsUploadDialogOpen(false)} 
              />
          </DialogContent>
      </Dialog>
    </>
  );
}
