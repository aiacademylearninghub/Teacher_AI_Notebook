"use client";

import React, { useState } from "react";
import { StudioDashboard } from "./studio-dashboard";
import { LocalStoryTool } from "./tools/local-story-tool";
import { WorksheetWizardTool } from "./tools/worksheet-wizard-tool";
import { SimpleExplainerTool } from "./tools/simple-explainer-tool";
import { LessonPlannerTool } from "./tools/lesson-planner-tool";
import { GameTimeTool } from "./tools/game-time-tool";
import { StudentAnalyzerTool } from "./tools/student-analyzer-tool";
import { Button } from "@/components/ui/button";
import { PanelRightClose } from "lucide-react";

type Tool =
  | "story"
  | "worksheet"
  | "explainer"
  | "planner"
  | "game"
  | "audio-overview"
  | "deep-dive"
  | "analyzer"
  | null;

interface StudioPanelProps {
  isOpen?: boolean;
  toggle?: () => void;
}

export function StudioPanel({ isOpen, toggle }: StudioPanelProps) {
  const [activeTool, setActiveTool] = useState<Tool>(null);

  const renderTool = () => {
    if (!activeTool) {
      return (
        <StudioDashboard onSelectTool={(id) => setActiveTool(id as Tool)} />
      );
    }

    const commonProps = {
      onBack: () => setActiveTool(null),
    };

    let toolComponent;
    switch (activeTool) {
      case "story":
        toolComponent = <LocalStoryTool {...commonProps} />;
        break;
      case "worksheet":
        toolComponent = <WorksheetWizardTool {...commonProps} />;
        break;
      case "explainer":
        toolComponent = <SimpleExplainerTool {...commonProps} />;
        break;
      case "planner":
        toolComponent = <LessonPlannerTool {...commonProps} />;
        break;
      case "game":
        toolComponent = <GameTimeTool {...commonProps} />;
        break;
      case "analyzer":
        toolComponent = <StudentAnalyzerTool {...commonProps} />;
        break;
      default:
        // Handle new placeholder tools
        setActiveTool(null);
        return (
          <StudioDashboard onSelectTool={(id) => setActiveTool(id as Tool)} />
        );
    }

    return toolComponent;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="hidden md:flex flex-col w-[350px] md:w-[400px] lg:w-[450px] border-l border-border bg-card/40">
      <div className="p-4 border-b border-border flex items-center justify-between h-16 shrink-0">
        <h2 className="text-lg font-semibold">Studio</h2>
        {toggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            title="Collapse studio panel"
          >
            <PanelRightClose className="w-5 h-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">{renderTool()}</div>
    </aside>
  );
}
