import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookText, ClipboardEdit, Lightbulb, GraduationCap, Gamepad2 } from "lucide-react";

interface StudioDashboardProps {
  onSelectTool: (toolId: string) => void;
}

const tools = [
  { id: "story", title: "Local Storytelling", description: "Generate stories with local context.", icon: BookText },
  { id: "worksheet", title: "Worksheet Wizard", description: "Create worksheets from lesson text.", icon: ClipboardEdit },
  { id: "explainer", title: "Simple Explainer", description: "Explain topics with simple analogies.", icon: Lightbulb },
  { id: "planner", title: "Lesson Planner", description: "Generate 5-day lesson plans.", icon: GraduationCap },
  { id: "game", title: "Game Time", description: "Play simple, interactive games.", icon: Gamepad2 },
];

const ToolButton = ({ tool, onSelect }: { tool: typeof tools[0], onSelect: (id: string) => void }) => {
    return (
        <Button 
            variant="ghost" 
            className="w-full h-auto justify-start p-3 text-left" 
            onClick={() => onSelect(tool.id)}
        >
            <div className="p-2 bg-muted rounded-lg mr-4">
              <tool.icon className="w-5 h-5 text-foreground/80" />
            </div>
            <div className="flex flex-col">
                <span className="font-semibold">{tool.title}</span>
                <span className="text-xs text-muted-foreground">{tool.description}</span>
            </div>
        </Button>
    )
}

export function StudioDashboard({ onSelectTool }: StudioDashboardProps) {
  return (
    <div className="space-y-6 animate-fade-in">
        <div>
            <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-base font-semibold">Teaching Aids</h3>
            </div>
            <Card className="bg-background/50">
                <CardContent className="p-1">
                  {tools.map((tool, index) => (
                      <React.Fragment key={tool.id}>
                          <ToolButton tool={tool} onSelect={onSelectTool} />
                          {index < tools.length - 1 && <div className="border-b border-border/50 mx-3" />}
                      </React.Fragment>
                  ))}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
