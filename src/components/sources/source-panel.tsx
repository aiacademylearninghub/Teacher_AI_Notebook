"use client"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Plus, Search, File, FolderArchive } from "lucide-react"
import { SourceCard } from "./source-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadSourceDialog } from './upload-source-dialog';

const mockSources: {name: string, type: string, icon: any}[] = [
  // { name: "Chapter 1: The Mauryan Empire", type: "pdf", icon: File },
]

export function SourcePanel() {
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sources</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-card hover:bg-muted justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a source</DialogTitle>
                </DialogHeader>
                <UploadSourceDialog />
            </DialogContent>
        </Dialog>
        <Button variant="outline" className="w-full bg-card hover:bg-muted justify-start">
          <Search className="mr-2 h-4 w-4" />
          Discover
        </Button>
      </div>

      {mockSources.length > 0 ? (
         <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {mockSources.map((source, index) => (
                <SourceCard key={index} {...source} />
              ))}
            </div>
         </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground p-4">
            <FolderArchive className="w-12 h-12" />
            <p className="font-semibold">Saved sources will appear here</p>
            <p className="text-sm">
            Click Add source above to add PDFs, websites, text, videos, or audio files. Or import a file directly from Google Drive.
            </p>
        </div>
      )}
    </div>
  )
}
