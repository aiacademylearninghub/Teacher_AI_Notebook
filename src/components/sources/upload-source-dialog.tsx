"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Globe, Image as ImageIcon, Video, Mic } from 'lucide-react';

export function UploadSourceDialog() {
  return (
    <div className="grid gap-4 py-4">
        <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted">
            <Upload className="mr-4 h-5 w-5"/> From Computer
        </Button>
        <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted">
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
