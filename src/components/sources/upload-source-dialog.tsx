"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Globe, Image as ImageIcon, Video, Mic, ArrowLeft } from 'lucide-react';
import { TextSourceForm } from './text-source-form';
import type { Source } from './source-panel';

interface UploadSourceDialogProps {
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  closeDialog: () => void;
}

export function UploadSourceDialog({ setSources, closeDialog }: UploadSourceDialogProps) {
  const [view, setView] = useState<'options' | 'text'>('options');

  if (view === 'text') {
    return (
        <div>
            <Button variant="ghost" onClick={() => setView('options')} className="mb-2 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to options
            </Button>
            <TextSourceForm setSources={setSources} onSourceAdded={closeDialog} />
        </div>
    );
  }

  return (
    <div className="grid gap-4 py-4">
        <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted">
            <Upload className="mr-4 h-5 w-5"/> From Computer
        </Button>
        <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted" onClick={() => setView('text')}>
            <FileText className="mr-4 h-5 w-5"/> Text
        </Button>
        <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted">
            <Globe className="mr-4 h-5 w-5"/> Website
        </Button>
        <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted">
            <ImageIcon className="mr-4 h-5 w-5"/> Image
        </Button>
        <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted">
            <Video className="mr-4 h-5 w-5"/> Video
        </Button>
         <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted">
            <Mic className="mr-4 h-5 w-5"/> Audio
        </Button>
    </div>
  );
}
