"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Share, GripHorizontal, Rss, PanelLeftOpen } from "lucide-react";

interface AppLayoutProps {
  sourcePanel: React.ReactNode;
  mainPanel: React.ReactNode;
  studioPanel: React.ReactNode;
}

export function AppLayout({ sourcePanel, mainPanel, studioPanel }: AppLayoutProps) {
    const [isStudioOpen, setIsStudioOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen bg-background text-foreground font-sans">
            <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-muted rounded-full">
                        <Rss className="w-5 h-5 text-foreground" />
                    </div>
                    <h1 className="text-lg font-semibold text-foreground/90">Untitled notebook</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:flex bg-card hover:bg-muted">New! Share publicly</Button>
                    <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground"><Share className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground"><Settings className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground"><GripHorizontal className="w-4 h-4"/></Button>
                    <Avatar className="h-8 w-8">
                        <AvatarImage data-ai-hint="person" src="https://placehold.co/40x40.png" alt="User avatar" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
            </header>
            <div className="flex flex-1 min-h-0">
                <aside className="hidden md:flex flex-col w-[320px] lg:w-[360px] border-r border-border">
                    {sourcePanel}
                </aside>
                <main className="flex-1 flex flex-col min-w-0">
                    {mainPanel}
                </main>
                {/* Clone studio panel and pass toggle function */}
                {React.cloneElement(studioPanel as React.ReactElement, { isOpen: isStudioOpen, toggle: () => setIsStudioOpen(!isStudioOpen) })}
                
                {!isStudioOpen && (
                     <div className="absolute top-16 right-0 h-[calc(100vh-4rem)] flex items-start p-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsStudioOpen(true)}
                            title="Open studio panel"
                        >
                            <PanelLeftOpen />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
