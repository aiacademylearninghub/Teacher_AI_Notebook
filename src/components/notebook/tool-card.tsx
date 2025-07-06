import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function ToolCard({ title, description, icon: Icon, onClick }: ToolCardProps) {
  return (
    <Card
      className="group h-full cursor-pointer transition-all bg-card/50 backdrop-blur-md border border-border/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <CardTitle className="pt-4 text-xl font-bold text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
