"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrainCircuit, Settings, Share, GripHorizontal, BookText, ClipboardEdit, Lightbulb, GraduationCap, Puzzle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const tools = [
  { href: "/story", label: "Local Storytelling", icon: BookText },
  { href: "/worksheet", label: "Worksheet Wizard", icon: ClipboardEdit },
  { href: "/explainer", label: "Simple Explainer", icon: Lightbulb },
  { href: "/planner", label: "Lesson Planner", icon: GraduationCap },
  { href: "/game", label: "Game Time", icon: Puzzle },
];


export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary rounded-full">
                        <BrainCircuit className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-lg font-semibold text-foreground/90 hidden sm:block">AI Notebook</h1>
                </Link>

                <nav className="hidden md:flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="bg-card hover:bg-muted">Studio Tools</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Teaching Aids</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {tools.map((tool) => (
                                <Link href={tool.href} key={tool.href} passHref>
                                     <DropdownMenuItem>
                                        <tool.icon className="mr-2 h-4 w-4" />
                                        <span>{tool.label}</span>
                                    </DropdownMenuItem>
                                </Link>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
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
    );
}
