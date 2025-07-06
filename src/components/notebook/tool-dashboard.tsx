import { ToolCard } from "./tool-card";
import { BookText, ClipboardEdit, Lightbulb, GraduationCap, Puzzle } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Welcome to your AI Notebook</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Select a tool to start creating amazing educational content.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
           <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="h-full"
          >
            <ToolCard
              {...tool}
              onClick={() => onSelectTool(tool.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
