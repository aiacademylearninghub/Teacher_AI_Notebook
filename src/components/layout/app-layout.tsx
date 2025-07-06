import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons";

interface AppLayoutProps {
  sourcePanel: React.ReactNode;
  children: React.ReactNode;
}

export function AppLayout({ sourcePanel, children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r border-sidebar-border/50">
        <SidebarHeader className="h-14 items-center justify-between px-3">
            <div className="flex items-center gap-2">
                <Logo className="size-6" />
                <h1 className="font-headline text-lg font-bold text-foreground">Bharat AI</h1>
            </div>
        </SidebarHeader>
        {sourcePanel}
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
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
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

