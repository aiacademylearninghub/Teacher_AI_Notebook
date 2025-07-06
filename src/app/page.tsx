"use client"

import { useState, type ComponentType } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ChatPanel } from '@/components/chat/chat-panel';
import { SourcePanel, type Source } from '@/components/sources/source-panel';
import { StudioNav } from '@/components/studio/studio-nav';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UploadSourceDialog } from '@/components/sources/upload-source-dialog';

// Tool Components
import { LocalStoryTool } from '@/components/studio/tools/local-story-tool';
import { WorksheetWizardTool } from '@/components/studio/tools/worksheet-wizard-tool';
import { SimpleExplainerTool } from '@/components/studio/tools/simple-explainer-tool';
import { LessonPlannerTool } from '@/components/studio/tools/lesson-planner-tool';
import { GameTimeTool } from '@/components/studio/tools/game-time-tool';

type ToolId = 'story' | 'worksheet' | 'explainer' | 'planner' | 'game';
type View = 'chat' | ToolId;

interface ToolProps {
  onBack: () => void;
}

const toolComponents: Record<ToolId, ComponentType<ToolProps>> = {
  story: LocalStoryTool,
  worksheet: WorksheetWizardTool,
  explainer: SimpleExplainerTool,
  planner: LessonPlannerTool,
  game: GameTimeTool,
};


export default function Home() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('chat');

  const handleToggleSource = (id: string) => {
    setSources(prevSources =>
      prevSources.map(source =>
        source.id === id ? { ...source, isSelected: !source.isSelected } : source
      )
    );
  };
  
  const selectedSources = sources.filter(source => source.isSelected);

  const renderMainContent = () => {
    if (activeView === 'chat') {
      return <ChatPanel sources={selectedSources} onAddSource={() => setIsUploadDialogOpen(true)} />;
    }
    const ToolComponent = toolComponents[activeView as ToolId];
    return <div className="p-8 h-full overflow-y-auto"><ToolComponent onBack={() => setActiveView('chat')} /></div>;
  };

  return (
    <>
      <AppLayout
        leftPanel={
          <StudioNav onSelectTool={(toolId) => setActiveView(toolId as View)} />
        }
        mainPanel={renderMainContent()}
        rightPanel={
          <SourcePanel 
            sources={sources} 
            onAddSource={() => setIsUploadDialogOpen(true)}
            onToggleSource={handleToggleSource}
          />
        }
      />
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
