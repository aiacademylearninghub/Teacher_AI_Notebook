import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Database, FileDown } from "lucide-react";

interface AppLayoutProps {
  sourcePanel: React.ReactNode;
  children: React.ReactNode;
}

export function AppLayout({ sourcePanel, children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r border-sidebar-border/20 bg-background/30 backdrop-blur-lg">
        <SidebarHeader className="h-14 items-center justify-between px-3">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-br from-green-400 to-cyan-400 rounded-md">
                    <Database className="size-5 text-white" />
                </div>
                <h1 className="font-bold text-lg text-foreground group-data-[collapsible=icon]:hidden">AI Notebook</h1>
            </div>
        </SidebarHeader>
        {sourcePanel}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border/20 bg-background/50 px-4 backdrop-blur-sm sm:px-6">
             <SidebarTrigger className="md:hidden" />
             <div/>
             <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
