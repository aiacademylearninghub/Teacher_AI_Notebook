import { ToolCard } from "./tool-card";
import { BookText, ClipboardEdit, Lightbulb, GraduationCap, Puzzle } from "lucide-react";

const tools = [
  {
    id: "story",
    title: "Local Storytelling",
    description: "Generate stories with local context and farmer analogies.",
    icon: BookText,
  },
  {
    id: "worksheet",
    title: "Worksheet Wizard",
    description: "Create differentiated worksheets from any lesson text.",
    icon: ClipboardEdit,
  },
  {
    id: "explainer",
    title: "Simple Explainer",
    description: "Explain complex topics with simple, real-life analogies.",
    icon: Lightbulb,
  },
  {
    id: "planner",
    title: "Lesson Planner",
    description: "Generate 5-day lesson plans for any topic.",
    icon: GraduationCap,
  },
  {
    id: "game",
    title: "Game Time",
    description: "Create educational paper or board games in minutes.",
    icon: Puzzle,
  },
];

interface ToolDashboardProps {
  onSelectTool: (toolId: any) => void;
}

export function ToolDashboard({ onSelectTool }: ToolDashboardProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Welcome to your Notebook</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Select a tool to start creating amazing educational content.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            {...tool}
            onClick={() => onSelectTool(tool.id)}
          />
        ))}
      </div>
    </div>
  );
}
