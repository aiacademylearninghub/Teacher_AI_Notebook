"use client";
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Globe, Image as ImageIcon, Video, Mic, ArrowLeft, Loader2 } from 'lucide-react';
import { TextSourceForm } from './text-source-form';
import type { Source } from './source-panel';
import { useToast } from '@/hooks/use-toast';
import { runExtractTextFromImage, runExtractTextFromPdf } from '@/lib/actions';

interface UploadSourceDialogProps {
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  closeDialog: () => void;
}

export function UploadSourceDialog({ setSources, closeDialog }: UploadSourceDialogProps) {
  const [view, setView] = useState<'options' | 'text'>('options');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the file input value to allow uploading the same file again
    event.target.value = '';

    setIsUploading(true);

    try {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const imageDataUri = e.target?.result as string;
            toast({ title: "Analyzing Image...", description: "Please wait while we extract the text." });
            const { text } = await runExtractTextFromImage({ imageDataUri });
            
            if (!text.trim()) {
                toast({ title: "No text found", description: "The image doesn't appear to contain any text.", variant: "destructive" });
                setIsUploading(false);
                return;
            }

            setSources(prev => [...prev, { name: file.name, content: text, icon: ImageIcon, type: 'image' }]);
            toast({ title: "Success!", description: `Source "${file.name}" has been added.` });
            closeDialog();
          } catch (err) {
            console.error(err);
            toast({ title: 'OCR Failed', description: 'Could not extract text from the image.', variant: 'destructive' });
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          toast({ title: 'File Read Error', description: 'Could not read the selected image file.', variant: 'destructive' });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const pdfDataUri = e.target?.result as string;
            toast({ title: "Analyzing PDF...", description: "Please wait while we extract the text." });
            const { text } = await runExtractTextFromPdf({ pdfDataUri });

            if (!text.trim()) {
                toast({ title: "No text found", description: "The PDF appears to be empty or could not be read.", variant: "destructive" });
                setIsUploading(false);
                return;
            }

            setSources(prev => [...prev, { name: file.name, content: text, icon: FileText, type: 'pdf' }]);
            toast({ title: "Success!", description: `Source "${file.name}" has been added.` });
            closeDialog();
          } catch (err) {
            console.error(err);
            toast({ title: 'PDF Parse Failed', description: 'Could not extract text from the PDF.', variant: 'destructive' });
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          toast({ title: 'File Read Error', description: 'Could not read the selected PDF file.', variant: 'destructive' });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        const text = await file.text();
        setSources(prev => [...prev, { name: file.name, content: text, icon: FileText, type: 'text' }]);
        toast({ title: "Success!", description: `Source "${file.name}" has been added.` });
        closeDialog();
        setIsUploading(false);
      } else {
        toast({ title: 'Unsupported File Type', description: 'Please upload a text (.txt, .md), image (.png, .jpg), or PDF (.pdf) file.', variant: 'destructive' });
        setIsUploading(false);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Upload Failed', description: 'An unexpected error occurred while processing the file.', variant: 'destructive' });
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/png,image/jpeg,image/webp,.txt,.md,application/pdf"
        disabled={isUploading}
      />
      <div className="grid gap-4 py-4">
          <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted" onClick={handleUploadClick} disabled={isUploading}>
              {isUploading ? (
                  <Loader2 className="mr-4 h-5 w-5 animate-spin"/>
              ) : (
                  <Upload className="mr-4 h-5 w-5"/>
              )}
              From Computer
          </Button>
          <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted" onClick={() => setView('text')} disabled={isUploading}>
              <FileText className="mr-4 h-5 w-5"/> Text
          </Button>
          <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted" disabled>
              <Globe className="mr-4 h-5 w-5"/> Website <span className="text-xs ml-auto text-muted-foreground">(coming soon)</span>
          </Button>
          <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted" disabled>
              <Video className="mr-4 h-5 w-5"/> Video <span className="text-xs ml-auto text-muted-foreground">(coming soon)</span>
          </Button>
          <Button variant="outline" className="justify-start h-12 text-base bg-card hover:bg-muted" disabled>
              <Mic className="mr-4 h-5 w-5"/> Audio <span className="text-xs ml-auto text-muted-foreground">(coming soon)</span>
          </Button>
      </div>
    </>
  );
}
