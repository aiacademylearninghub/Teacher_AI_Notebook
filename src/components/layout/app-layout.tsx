"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeftOpen, PanelRightOpen, Menu } from "lucide-react";
import { useMediaQuery } from '@/hooks/use-media-query';

interface AppLayoutProps {
  leftPanel: React.ReactNode;
  mainPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export function AppLayout({ leftPanel, mainPanel, rightPanel }: AppLayoutProps) {
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

    useEffect(() => {
      setIsLeftPanelOpen(isDesktop);
    }, [isDesktop]);

    if (isDesktop) {
        return (
            <div className="flex h-screen bg-background text-foreground">
                {isLeftPanelOpen && (
                    React.cloneElement(leftPanel as React.ReactElement, { 
                        isExpanded: true, 
                        onToggle: () => setIsLeftPanelOpen(false) 
                    })
                )}

                <main className="flex-1 flex flex-col relative min-w-0">
                    {!isLeftPanelOpen && (
                        <div className="absolute top-4 left-4 z-10">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="bg-card"
                                onClick={() => setIsLeftPanelOpen(true)}
                                title="Open Tools"
                            >
                                <PanelRightOpen />
                            </Button>
                        </div>
                    )}

                    {mainPanel}

                    {!isRightPanelOpen && (
                        <div className="absolute top-4 right-4 z-10">
                            <Button variant="outline" size="sm" className="bg-card" onClick={() => setIsRightPanelOpen(true)}>
                                <PanelLeftOpen className="mr-2 h-4 w-4" />
                                Sources
                            </Button>
                        </div>
                    )}
                </main>

                {isRightPanelOpen && (
                    <aside className="w-[320px] lg:w-[360px] border-l border-border flex-shrink-0">
                        {React.cloneElement(rightPanel as React.ReactElement, {
                            onClose: () => setIsRightPanelOpen(false)
                        })}
                    </aside>
                )}
            </div>
        );
    }
    
    // Mobile Layout
    const originalOnSelectTool = (leftPanel as React.ReactElement).props.onSelectTool;
    const leftPanelWithClose = React.cloneElement(leftPanel as React.ReactElement, {
        isExpanded: true,
        onToggle: () => setIsLeftPanelOpen(false),
        onSelectTool: (toolId: string) => {
            if (originalOnSelectTool) originalOnSelectTool(toolId);
            setIsLeftPanelOpen(false);
        },
    });

    const rightPanelWithClose = React.cloneElement(rightPanel as React.ReactElement, {
        onClose: () => setIsRightPanelOpen(false),
    });

    return (
        <div className="h-screen bg-background text-foreground">
            <div className="h-full flex flex-col">
                <header className="p-2 flex justify-between items-center z-20 shrink-0 border-b border-border bg-background/80 backdrop-blur-sm">
                    {/* Left Panel Sheet (Tools) */}
                    <Sheet open={isLeftPanelOpen} onOpenChange={setIsLeftPanelOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="bg-card">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[300px] sm:w-[360px]">
                            {leftPanelWithClose}
                        </SheetContent>
                    </Sheet>
                    
                    <Link href="/" className="font-semibold text-foreground/90" onClick={(e) => { e.preventDefault(); if (originalOnSelectTool) { originalOnSelectTool('chat'); } setIsLeftPanelOpen(false); }}>
                        AI Notebook
                    </Link>

                    {/* Right Panel Sheet (Sources) */}
                    <Sheet open={isRightPanelOpen} onOpenChange={setIsRightPanelOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-card">
                                <PanelLeftOpen className="mr-2 h-4 w-4" />
                                Sources
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-[300px] sm:w-[320px]">
                             {rightPanelWithClose}
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 min-h-0">
                    {mainPanel}
                </main>
            </div>
        </div>
    );
}