import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface SourceCardProps {
  name: string;
  icon: LucideIcon;
}

export function SourceCard({ name, icon: Icon }: SourceCardProps) {
  return (
    <div className="group relative flex items-center justify-between rounded-md p-2 hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-sm font-medium">{name}</span>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
