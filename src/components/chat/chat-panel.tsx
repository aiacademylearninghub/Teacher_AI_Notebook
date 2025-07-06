"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Send, User, BrainCircuit, ImageIcon, Mic, Loader2 } from 'lucide-react';
import type { Source } from '@/components/sources/source-panel';
import { runChatWithSources, runGenerateImage, runGenerateAudio } from '@/lib/actions';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  originalQuestion?: string;
  showImageGenerator?: boolean;
  showAudioGenerator?: boolean;
  imageUrl?: string;
  audioUrl?: string;
  isGeneratingImage?: boolean;
  isGeneratingAudio?: boolean;
}

interface ChatPanelProps {
  sources: Source[];
  onAddSource: () => void;
}

const sampleQuestions = [
    "Summarize the key points of this document.",
    "What are the main arguments presented?",
    "List the most important facts from this source.",
    "Create a few quiz questions based on this content."
];

export function ChatPanel({ sources, onAddSource }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasSources = sources.length > 0;

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const scrollHeight = textareaRef.current.scrollHeight;
        const maxHeight = 200; // Cap height at 200px
        textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
  };

  const handleSampleQuestionClick = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

  const handleGenerateImage = async (messageId: string, prompt: string) => {
    updateMessage(messageId, { isGeneratingImage: true, showImageGenerator: false });
    try {
      const response = await runGenerateImage({ prompt });
      updateMessage(messageId, { imageUrl: response.imageUrl, isGeneratingImage: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      updateMessage(messageId, { isGeneratingImage: false, showImageGenerator: true });
      console.error(error);
    }
  };

  const handleGenerateAudio = async (messageId: string, text: string) => {
    updateMessage(messageId, { isGeneratingAudio: true, showAudioGenerator: false });
    try {
      const response = await runGenerateAudio({ text });
      updateMessage(messageId, { audioUrl: response.audioUrl, isGeneratingAudio: false });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
      updateMessage(messageId, { isGeneratingAudio: false, showAudioGenerator: true });
      console.error(error);
    }
  };


  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !hasSources) return;

    const userMessage: ChatMessage = { id: nanoid(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await runChatWithSources({ 
        question: currentInput, 
        sources: sources.map(s => ({name: s.name, content: s.content})) 
      });
      const assistantMessage: ChatMessage = { 
        id: nanoid(), 
        role: 'assistant', 
        content: response.answer,
        originalQuestion: currentInput,
        showImageGenerator: true,
        showAudioGenerator: true,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      setInput(currentInput); // Restore input on failure
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChatContent = () => {
    if (!hasSources) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="p-4 bg-muted rounded-full">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Add a source to get started</h2>
            <p className="text-sm text-muted-foreground">Upload a file or paste some text to begin chatting with your documents.</p>
            <Button variant="outline" className="bg-card hover:bg-muted" onClick={onAddSource}>Upload a source</Button>
        </div>
      );
    }

    if (messages.length === 0) {
         return (
             <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="p-4 bg-muted rounded-full">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Ready to Chat</h2>
                <p className="text-sm text-muted-foreground">Ask questions, get summaries, or brainstorm ideas based on your sources.</p>
                <div className="mt-4 w-full max-w-md space-y-2">
                    <p className="text-sm text-muted-foreground">Or try one of these suggestions:</p>
                    {sampleQuestions.map((q, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-2 bg-card hover:bg-muted"
                            onClick={() => handleSampleQuestionClick(q)}
                        >
                            {q}
                        </Button>
                    ))}
                </div>
             </div>
         );
    }

    return (
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                   {message.role === 'assistant' && (
                       <Avatar className="h-8 w-8 shrink-0">
                         <AvatarFallback className="bg-primary text-primary-foreground"><BrainCircuit className="w-4 h-4" /></AvatarFallback>
                       </Avatar>
                   )}
                   <div className={`rounded-lg p-3 max-w-[85%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        
                        <div className="mt-4 space-y-4">
                          {message.imageUrl && (
                              <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                  <Image src={message.imageUrl} alt={`Generated image for ${message.originalQuestion}`} layout="fill" objectFit="contain" />
                              </div>
                          )}
                          {message.audioUrl && (
                              <audio controls src={message.audioUrl} className="w-full">
                                  Your browser does not support the audio element.
                              </audio>
                          )}
                        </div>

                        {(message.showImageGenerator || message.showAudioGenerator || message.isGeneratingImage || message.isGeneratingAudio) && (
                          <div className="mt-4 pt-3 border-t border-muted-foreground/20 flex flex-wrap gap-2">
                            {message.showImageGenerator && (
                              <Button size="sm" variant="outline" className="bg-card hover:bg-muted" onClick={() => handleGenerateImage(message.id, message.originalQuestion!)}>
                                <ImageIcon className="mr-2 h-4 w-4" /> Generate Image
                              </Button>
                            )}
                            {message.isGeneratingImage && (
                              <Button size="sm" variant="outline" className="bg-card" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                              </Button>
                            )}
                            {message.showAudioGenerator && (
                              <Button size="sm" variant="outline" className="bg-card hover:bg-muted" onClick={() => handleGenerateAudio(message.id, message.content)}>
                                <Mic className="mr-2 h-4 w-4" /> Generate Audio
                              </Button>
                            )}
                            {message.isGeneratingAudio && (
                              <Button size="sm" variant="outline" className="bg-card" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                              </Button>
                            )}
                          </div>
                        )}
                   </div>
                   {message.role === 'user' && (
                       <Avatar className="h-8 w-8 shrink-0">
                         <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                       </Avatar>
                   )}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-4">
                     <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground"><BrainCircuit className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted w-full max-w-lg space-y-2">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 flex flex-col min-h-0">
        {renderChatContent()}
      </div>
      <div className="p-4 border-t border-border shrink-0">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative"
        >
          <Textarea 
            ref={textareaRef}
            placeholder={hasSources ? "Ask a question about your sources..." : "Upload a source to get started"}
            className="bg-card border-border pr-12 text-base resize-none overflow-y-auto min-h-0"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                }
            }}
            disabled={!hasSources || isLoading}
          />
          <Button type="submit" variant="ghost" size="icon" className="absolute right-2 bottom-2 text-muted-foreground hover:text-foreground" disabled={!hasSources || isLoading}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2">
            AI Notebook can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
