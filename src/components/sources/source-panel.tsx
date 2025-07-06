"use client"

import { Button } from "@/components/ui/button"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { UploadCloud, FileText, FileAudio, FileImage } from "lucide-react"
import { SourceCard } from "./source-card"

const mockSources = [
  { name: "Chapter 1: The Mauryan Empire", type: "pdf", icon: FileText },
  { name: "Classroom Lecture Recording", type: "audio", icon: FileAudio },
  { name: "Whiteboard Notes", type: "image", icon: FileImage },
  { name: "History of India.pdf", type: "pdf", icon: FileText },
]

export function SourcePanel() {
  return (
    <>
      <div className="p-2">
        <Button className="w-full" variant="outline">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Source
        </Button>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sources</SidebarGroupLabel>
          <div className="flex flex-col gap-2">
            {mockSources.map((source, index) => (
              <SourceCard key={index} {...source} />
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}
