"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

interface AppLayoutProps {
  leftPanel: React.ReactNode;
  mainPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export function AppLayout({ leftPanel, mainPanel, rightPanel }: AppLayoutProps) {
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background text-foreground">
            {isLeftPanelOpen && (
                React.cloneElement(leftPanel as React.ReactElement, { 
                    isExpanded: true, 
                    onToggle: () => setIsLeftPanelOpen(false) 
                })
            )}

            <main className="flex-1 flex flex-col relative">
                {!isLeftPanelOpen && (
                    <div className="absolute top-2 left-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsLeftPanelOpen(true)}
                            title="Open sidebar"
                        >
                            <PanelRightOpen />
                        </Button>
                    </div>
                )}

                {mainPanel}

                {!isRightPanelOpen && (
                    <div className="absolute top-4 right-4">
                        <Button variant="outline" size="sm" className="bg-card" onClick={() => setIsRightPanelOpen(true)}>
                            <PanelLeftOpen className="mr-2 h-4 w-4" />
                            Sources
                        </Button>
                    </div>
                )}
            </main>

            {isRightPanelOpen && (
                <aside className="w-[320px] lg:w-[360px]">
                    {React.cloneElement(rightPanel as React.ReactElement, {
                        onClose: () => setIsRightPanelOpen(false)
                    })}
                </aside>
            )}
        </div>
    );
}
