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
      className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <CardTitle className="font-headline pt-4 text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
