import type { Source } from "./source-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";

interface SourceCardProps {
  source: Source;
  onToggleSource: (id: string) => void;
}

export function SourceCard({ source, onToggleSource }: SourceCardProps) {
  const { id, name, icon: Icon, isSelected } = source;
  return (
    <div className="group relative flex items-center justify-between rounded-md pr-2 hover:bg-accent/50 transition-colors">
      <label htmlFor={`source-${id}`} className="flex flex-1 items-center gap-3 p-2 cursor-pointer">
        <Checkbox 
          id={`source-${id}`}
          checked={isSelected}
          onCheckedChange={() => onToggleSource(id)}
          aria-label={`Select source ${name}`}
        />
        <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm font-medium">{name}</span>
      </label>
      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
