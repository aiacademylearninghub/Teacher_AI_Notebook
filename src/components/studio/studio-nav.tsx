"use client";

import React from 'react';
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
    BrainCircuit, 
    PanelLeftClose, 
    MessageSquare, 
    User, 
    LifeBuoy, 
    LogOut, 
    Sun, 
    Moon 
} from "lucide-react";
import { StudioDashboard } from './studio-dashboard';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudioNavProps {
    onSelectTool: (tool: string) => void;
    onToggle?: () => void;
    isExpanded?: boolean;
}

export function StudioNav({ onSelectTool, onToggle, isExpanded }: StudioNavProps) {
    const { setTheme } = useTheme();

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
                        <h1 className="font-headline text-xl font-semibold text-foreground/90">AI Notebook</h1>
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

            <div className="mt-auto p-4 border-t border-border">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start text-left h-auto p-2">
                            <Avatar className="h-9 w-9 mr-3">
                                <AvatarImage src="https://placehold.co/40x40.png" alt="User profile" data-ai-hint="person user" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">Guest User</span>
                                <span className="text-xs text-muted-foreground">teacher@example.com</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Sun className="h-4 w-4 mr-2 dark:hidden" />
                                <Moon className="h-4 w-4 mr-2 hidden dark:inline-block" />
                                <span>Theme</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href="https://firebase.google.com/docs/genai" target="_blank" rel="noopener noreferrer">
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                <span>AI Academy</span>
                            </a>
                        </DropdownMenuItem>
                         <DropdownMenuItem disabled>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}
