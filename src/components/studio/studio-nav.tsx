"use client";

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, PanelLeftClose, MessageSquare } from "lucide-react";
import { StudioDashboard } from './studio-dashboard';

interface StudioNavProps {
    onSelectTool: (tool: string) => void;
    onToggle?: () => void;
    isExpanded?: boolean;
}

export function StudioNav({ onSelectTool, onToggle, isExpanded }: StudioNavProps) {
    if (!isExpanded) {
        return null;
    }

    return (
        <aside className="flex flex-col w-[320px] lg:w-[360px] border-r border-border bg-background animate-fade-in">
             <div className="p-4 border-b border-border flex items-center justify-between h-16 shrink-0">
                <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href="/" className="flex items-center gap-3" onClick={(e) => { e.preventDefault(); onSelectTool('chat'); }}>
                        <div className="p-1.5 bg-primary rounded-full">
                            <BrainCircuit className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-lg font-semibold text-foreground/90">AI Notebook</h1>
                    </Link>
                </Button>
                {onToggle && (
                    <Button variant="ghost" size="icon" onClick={onToggle} title="Collapse sidebar">
                        <PanelLeftClose className="w-5 h-5" />
                    </Button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <Button 
                    variant="ghost" 
                    className="w-full h-auto justify-start p-3 text-left bg-muted" 
                    onClick={() => onSelectTool('chat')}
                >
                    <div className="p-2 bg-background rounded-lg mr-4">
                      <MessageSquare className="w-5 h-5 text-foreground/80" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">Notebook Chat</span>
                        <span className="text-xs text-muted-foreground">Chat with your sources</span>
                    </div>
                </Button>
                <StudioDashboard onSelectTool={onSelectTool} />
            </div>
        </aside>
    );
}
